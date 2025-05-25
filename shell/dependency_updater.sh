#!/bin/bash

# dependency_updater.sh - Automated dependency management with security checks

# Default configuration
DEFAULT_PACKAGE_MANAGER="auto"
DEFAULT_UPDATE_MODE="safe"
DEFAULT_BACKUP_DIR=".dependency"
DEFAULT_SECURITY_CHECK="true"
DEFAULT_DRY_RUN="false"
DEFAULT_PROJECT_ROOT="auto"

# Configuration variables
PACKAGE_MANAGER="${PACKAGE_MANAGER:-$DEFAULT_PACKAGE_MANAGER}"
UPDATE_MODE="${UPDATE_MODE:-$DEFAULT_UPDATE_MODE}"
BACKUP_DIR="${BACKUP_DIR:-$DEFAULT_BACKUP_DIR}"
SECURITY_CHECK="${SECURITY_CHECK:-$DEFAULT_SECURITY_CHECK}"
DRY_RUN="${DRY_RUN:-$DEFAULT_DRY_RUN}"
PROJECT_ROOT="${PROJECT_ROOT:-$DEFAULT_PROJECT_ROOT}"

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Help function
show_help() {
    cat << EOF
🔄 Dependency Updater - Automated package updates with security checks

USAGE:
    ./dependency_updater.sh [OPTIONS]

DESCRIPTION:
    Automatically updates project dependencies across multiple package managers
    with security vulnerability scanning and backup functionality.

OPTIONS:
    --package-manager TYPE   Package manager to use (auto|npm|yarn|pnpm|cargo|go|pip|composer) (default: $DEFAULT_PACKAGE_MANAGER)
    --update-mode MODE       Update strategy (safe|major|patch|minor|all) (default: $DEFAULT_UPDATE_MODE)
    --backup-dir DIR         Backup directory for rollback (default: $DEFAULT_BACKUP_DIR)
    --project-root DIR       Project root directory (auto|.|..|path) (default: $DEFAULT_PROJECT_ROOT)
    --security-check         Enable security vulnerability scanning (default: $DEFAULT_SECURITY_CHECK)
    --no-security           Disable security vulnerability scanning
    --dry-run               Preview changes without applying them
    --restore BACKUP_ID     Restore from backup (use backup timestamp)
    --list-backups          Show available backups
    --clean-backups         Remove old backups (keeps last 5)
    -h, --help              Show this help message and exit

UPDATE MODES:
    safe     - Only security updates and patch versions
    patch    - Patch version updates only
    minor    - Minor and patch version updates
    major    - Major version updates (potentially breaking)
    all      - Update everything to latest versions

PROJECT ROOT DETECTION:
    auto     - Automatically search for package files in current and parent directories
    .        - Use current directory
    ..       - Use parent directory
    path     - Use specific path

SUPPORTED PACKAGE MANAGERS:
    🟢 npm      - Node.js (package.json)
    🟢 yarn     - Node.js (package.json with yarn.lock)
    🟢 pnpm     - Node.js (package.json with pnpm-lock.yaml)
    🟢 cargo    - Rust (Cargo.toml)
    🟢 go       - Go (go.mod)
    🟢 pip      - Python (requirements.txt, setup.py, pyproject.toml)
    🟢 composer - PHP (composer.json)

EXAMPLES:
    ./dependency_updater.sh                                    # Auto-detect project root and safe update
    ./dependency_updater.sh --project-root ..                 # Use parent directory
    ./dependency_updater.sh --package-manager npm --dry-run   # Preview npm updates
    ./dependency_updater.sh --update-mode major --no-security # Major updates without security scan
    ./dependency_updater.sh --restore 20250525_003649         # Restore from backup

SECURITY FEATURES:
    🔍 Vulnerability scanning using npm audit, cargo audit, etc.
    🛡️ Automatic backup before updates
    🔄 Easy rollback functionality
    📊 Detailed security reports
    ⚠️  Breaking change warnings

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --package-manager)
            PACKAGE_MANAGER="$2"
            shift 2
            ;;
        --update-mode)
            UPDATE_MODE="$2"
            shift 2
            ;;
        --backup-dir)
            BACKUP_DIR="$2"
            shift 2
            ;;
        --project-root)
            PROJECT_ROOT="$2"
            shift 2
            ;;
        --security-check)
            SECURITY_CHECK="true"
            shift
            ;;
        --no-security)
            SECURITY_CHECK="false"
            shift
            ;;
        --dry-run)
            DRY_RUN="true"
            shift
            ;;
        --restore)
            RESTORE_BACKUP="$2"
            shift 2
            ;;
        --list-backups)
            LIST_BACKUPS="true"
            shift
            ;;
        --clean-backups)
            CLEAN_BACKUPS="true"
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Unknown parameter: $1${NC}"
            echo -e "${BLUE}💡 For help: $0 --help${NC}"
            exit 1
            ;;
    esac
done

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${PURPLE}🔄 $1${NC}"
}

# Silent log functions (no colors, for file output)
log_plain() {
    echo "$1"
}

# Function to find project root
find_project_root() {
    local search_dir="${1:-$(pwd)}"
    local max_depth=3
    local current_depth=0
    
    # If PROJECT_ROOT is set to a specific path, use it
    if [[ "$PROJECT_ROOT" != "auto" ]]; then
        if [[ -d "$PROJECT_ROOT" ]]; then
            # Convert to absolute path
            cd "$PROJECT_ROOT" && pwd
            return 0
        else
            log_error "Specified project root does not exist: $PROJECT_ROOT"
            return 1
        fi
    fi
    
    # Search in current and parent directories
    local check_dir="$(realpath "$search_dir")"
    while [[ $current_depth -le $max_depth ]]; do
        # Check for various package files
        if [[ -f "$check_dir/package.json" ]] || \
           [[ -f "$check_dir/Cargo.toml" ]] || \
           [[ -f "$check_dir/go.mod" ]] || \
           [[ -f "$check_dir/requirements.txt" ]] || \
           [[ -f "$check_dir/setup.py" ]] || \
           [[ -f "$check_dir/pyproject.toml" ]] || \
           [[ -f "$check_dir/composer.json" ]]; then
            echo "$check_dir"
            return 0
        fi
        
        # Move to parent directory
        check_dir="$(dirname "$check_dir")"
        current_depth=$((current_depth + 1))
        
        # Stop if we reach root
        if [[ "$check_dir" == "/" ]]; then
            break
        fi
    done
    
    log_error "No project files found in current or parent directories"
    return 1
}

# Function to detect package manager in specific directory
detect_package_manager() {
    local project_dir="$1"
    local detected=""
    
    if [[ -f "$project_dir/package.json" ]]; then
        if [[ -f "$project_dir/pnpm-lock.yaml" ]]; then
            detected="pnpm"
        elif [[ -f "$project_dir/yarn.lock" ]]; then
            detected="yarn"
        else
            detected="npm"
        fi
    elif [[ -f "$project_dir/Cargo.toml" ]]; then
        detected="cargo"
    elif [[ -f "$project_dir/go.mod" ]]; then
        detected="go"
    elif [[ -f "$project_dir/requirements.txt" || -f "$project_dir/setup.py" || -f "$project_dir/pyproject.toml" ]]; then
        detected="pip"
    elif [[ -f "$project_dir/composer.json" ]]; then
        detected="composer"
    fi
    
    echo "$detected"
}

# Function to check if tool is installed
check_tool() {
    local tool="$1"
    if ! command -v "$tool" &> /dev/null; then
        return 1
    fi
    return 0
}

# Function to install package manager tools
install_package_manager() {
    local pm="$1"
    
    case "$pm" in
        npm)
            if ! check_tool "node"; then
                log_error "Node.js is required for npm"
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    log_info "Install with: brew install node"
                else
                    log_info "Install Node.js from: https://nodejs.org/"
                fi
                return 1
            fi
            ;;
        yarn)
            if ! check_tool "yarn"; then
                log_step "Installing Yarn..."
                npm install -g yarn
            fi
            ;;
        pnpm)
            if ! check_tool "pnpm"; then
                log_step "Installing pnpm..."
                npm install -g pnpm
            fi
            ;;
        cargo)
            if ! check_tool "cargo"; then
                log_error "Rust toolchain is required"
                log_info "Install with: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
                return 1
            fi
            ;;
        go)
            if ! check_tool "go"; then
                log_error "Go is required"
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    log_info "Install with: brew install go"
                else
                    log_info "Install Go from: https://golang.org/dl/"
                fi
                return 1
            fi
            ;;
        pip)
            if ! check_tool "pip"; then
                log_error "Python pip is required"
                log_info "Install Python from: https://python.org/"
                return 1
            fi
            ;;
        composer)
            if ! check_tool "composer"; then
                log_step "Installing Composer..."
                curl -sS https://getcomposer.org/installer | php
                sudo mv composer.phar /usr/local/bin/composer
            fi
            ;;
    esac
    return 0
}

# Function to create backup
create_backup() {
    local pm="$1"
    local project_dir="$2"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    
    # Get parent directory of script (nitrokit directory)
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local parent_dir="$(dirname "$script_dir")"
    local backup_path="$parent_dir/$BACKUP_DIR/$timestamp"
    
    log_step "Creating backup: $backup_path"
    mkdir -p "$backup_path"
    
    case "$pm" in
        npm|yarn|pnpm)
            cp "$project_dir/package.json" "$backup_path/" 2>/dev/null || true
            cp "$project_dir/package-lock.json" "$backup_path/" 2>/dev/null || true
            cp "$project_dir/yarn.lock" "$backup_path/" 2>/dev/null || true
            cp "$project_dir/pnpm-lock.yaml" "$backup_path/" 2>/dev/null || true
            ;;
        cargo)
            cp "$project_dir/Cargo.toml" "$backup_path/" 2>/dev/null || true
            cp "$project_dir/Cargo.lock" "$backup_path/" 2>/dev/null || true
            ;;
        go)
            cp "$project_dir/go.mod" "$backup_path/" 2>/dev/null || true
            cp "$project_dir/go.sum" "$backup_path/" 2>/dev/null || true
            ;;
        pip)
            cp "$project_dir/requirements.txt" "$backup_path/" 2>/dev/null || true
            cp "$project_dir/setup.py" "$backup_path/" 2>/dev/null || true
            cp "$project_dir/pyproject.toml" "$backup_path/" 2>/dev/null || true
            ;;
        composer)
            cp "$project_dir/composer.json" "$backup_path/" 2>/dev/null || true
            cp "$project_dir/composer.lock" "$backup_path/" 2>/dev/null || true
            ;;
    esac
    
    # Create backup info file without color codes
    {
        echo "$timestamp"
        echo "$pm"
        echo "$(date)"
        echo "$project_dir"
    } > "$backup_path/.backup_info"
    
    log_success "Backup created: $timestamp"
    echo "$timestamp"
}

# Function to restore from backup
restore_backup() {
    local backup_id="$1"
    
    # Get parent directory of script (nitrokit directory)
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local parent_dir="$(dirname "$script_dir")"
    local backup_path="$parent_dir/$BACKUP_DIR/$backup_id"
    
    if [[ ! -d "$backup_path" ]]; then
        log_error "Backup not found: $backup_id"
        return 1
    fi
    
    local backup_info="$backup_path/.backup_info"
    local original_project_dir="."
    
    if [[ -f "$backup_info" ]]; then
        original_project_dir=$(sed -n '4p' "$backup_info")
    fi
    
    log_step "Restoring from backup: $backup_id to $original_project_dir"
    
    # Copy files back to original project directory
    for file in "$backup_path"/*; do
        if [[ -f "$file" && "$(basename "$file")" != ".backup_info" ]]; then
            cp "$file" "$original_project_dir/"
            log_info "Restored: $(basename "$file") to $original_project_dir"
        fi
    done
    
    log_success "Backup restored successfully"
}

# Function to list backups
list_backups() {
    # Get parent directory of script (nitrokit directory)
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local parent_dir="$(dirname "$script_dir")"
    local backup_dir="$parent_dir/$BACKUP_DIR"
    
    if [[ ! -d "$backup_dir" ]]; then
        log_info "No backups found"
        return 0
    fi
    
    echo -e "${CYAN}📋 Available Backups:${NC}"
    echo "----------------------------------------"
    
    for backup in "$backup_dir"/*; do
        if [[ -d "$backup" && -f "$backup/.backup_info" ]]; then
            local backup_id=$(basename "$backup")
            local pm=$(sed -n '2p' "$backup/.backup_info")
            local date=$(sed -n '3p' "$backup/.backup_info")
            local project_dir=$(sed -n '4p' "$backup/.backup_info")
            
            echo -e "${YELLOW}🗂️  $backup_id${NC}"
            echo "   Package Manager: $pm"
            echo "   Project Dir: $project_dir"
            echo "   Created: $date"
            echo ""
        fi
    done
}

# Function to clean old backups
clean_backups() {
    # Get parent directory of script (nitrokit directory)
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local parent_dir="$(dirname "$script_dir")"
    local backup_dir="$parent_dir/$BACKUP_DIR"
    
    if [[ ! -d "$backup_dir" ]]; then
        log_info "No backups to clean"
        return 0
    fi
    
    log_step "Cleaning old backups (keeping last 5)..."
    
    # Get sorted list of backups (newest first)
    local backups=($(ls -1t "$backup_dir"))
    local count=${#backups[@]}
    
    if [[ $count -le 5 ]]; then
        log_info "Only $count backups found, nothing to clean"
        return 0
    fi
    
    # Remove backups beyond the first 5
    for ((i=5; i<count; i++)); do
        local backup_path="$backup_dir/${backups[$i]}"
        if [[ -d "$backup_path" ]]; then
            rm -rf "$backup_path"
            log_info "Removed old backup: ${backups[$i]}"
        fi
    done
    
    log_success "Cleaned $((count-5)) old backups"
}

# Function to run security audit
run_security_audit() {
    local pm="$1"
    local project_dir="$2"
    
    log_step "Running security audit in: $project_dir"
    
    # Change to project directory for audit
    local original_dir=$(pwd)
    cd "$project_dir"
    
    case "$pm" in
        npm)
            if check_tool "npm"; then
                npm audit --audit-level=moderate
            fi
            ;;
        yarn)
            if check_tool "yarn"; then
                yarn audit --level moderate
            fi
            ;;
        pnpm)
            if check_tool "pnpm"; then
                pnpm audit --audit-level moderate
            fi
            ;;
        cargo)
            if ! check_tool "cargo-audit"; then
                log_step "Installing cargo-audit..."
                cargo install cargo-audit
            fi
            cargo audit
            ;;
        pip)
            if ! check_tool "safety"; then
                log_step "Installing safety..."
                pip install safety
            fi
            safety check
            ;;
        *)
            log_warning "Security audit not available for $pm"
            ;;
    esac
    
    # Return to original directory
    cd "$original_dir"
}

# Function to update dependencies
update_dependencies() {
    local pm="$1"
    local mode="$2"
    local project_dir="$3"
    
    log_step "Updating dependencies with $pm in $mode mode (project: $project_dir)..."
    
    # Change to project directory for updates
    local original_dir=$(pwd)
    cd "$project_dir"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "DRY RUN: Would update dependencies with the following command:"
    fi
    
    case "$pm" in
        npm)
            case "$mode" in
                safe)
                    if [[ "$DRY_RUN" == "true" ]]; then
                        echo "npm update"
                    else
                        npm update
                    fi
                    ;;
                patch)
                    if [[ "$DRY_RUN" == "true" ]]; then
                        echo "npm update --save-exact"
                    else
                        npm update --save-exact
                    fi
                    ;;
                minor|major|all)
                    if ! check_tool "npm-check-updates"; then
                        log_step "Installing npm-check-updates..."
                        npm install -g npm-check-updates
                    fi
                    local ncu_args=""
                    [[ "$mode" == "minor" ]] && ncu_args="--target minor"
                    [[ "$mode" == "patch" ]] && ncu_args="--target patch"
                    
                    if [[ "$DRY_RUN" == "true" ]]; then
                        echo "ncu $ncu_args --upgrade && npm install"
                    else
                        ncu $ncu_args --upgrade
                        npm install
                    fi
                    ;;
            esac
            ;;
        yarn)
            case "$mode" in
                safe|patch)
                    if [[ "$DRY_RUN" == "true" ]]; then
                        echo "yarn upgrade"
                    else
                        yarn upgrade
                    fi
                    ;;
                minor|major|all)
                    if [[ "$DRY_RUN" == "true" ]]; then
                        echo "yarn upgrade --latest"
                    else
                        yarn upgrade --latest
                    fi
                    ;;
            esac
            ;;
        pnpm)
            case "$mode" in
                safe|patch)
                    if [[ "$DRY_RUN" == "true" ]]; then
                        echo "pnpm update"
                    else
                        pnpm update
                    fi
                    ;;
                minor|major|all)
                    if [[ "$DRY_RUN" == "true" ]]; then
                        echo "pnpm update --latest"
                    else
                        pnpm update --latest
                    fi
                    ;;
            esac
            ;;
        cargo)
            if [[ "$DRY_RUN" == "true" ]]; then
                echo "cargo update"
            else
                cargo update
            fi
            ;;
        go)
            case "$mode" in
                safe|patch|minor)
                    if [[ "$DRY_RUN" == "true" ]]; then
                        echo "go get -u=patch ./..."
                    else
                        go get -u=patch ./...
                    fi
                    ;;
                major|all)
                    if [[ "$DRY_RUN" == "true" ]]; then
                        echo "go get -u ./..."
                    else
                        go get -u ./...
                    fi
                    ;;
            esac
            ;;
        pip)
            if ! check_tool "pip-tools"; then
                log_step "Installing pip-tools..."
                pip install pip-tools
            fi
            
            if [[ "$DRY_RUN" == "true" ]]; then
                echo "pip-compile --upgrade requirements.in && pip-sync"
            else
                if [[ -f "requirements.in" ]]; then
                    pip-compile --upgrade requirements.in
                    pip-sync
                elif [[ -f "requirements.txt" ]]; then
                    pip install --upgrade -r requirements.txt
                fi
            fi
            ;;
        composer)
            if [[ "$DRY_RUN" == "true" ]]; then
                echo "composer update"
            else
                composer update
            fi
            ;;
    esac
    
    # Return to original directory
    cd "$original_dir"
}

# Function to show update summary
show_update_summary() {
    local pm="$1"
    local project_dir="$2"
    
    log_step "Generating update summary..."
    
    # Change to project directory
    local original_dir=$(pwd)
    cd "$project_dir"
    
    case "$pm" in
        npm|yarn|pnpm)
            if check_tool "npm"; then
                echo -e "${CYAN}📊 Package Summary:${NC}"
                npm list --depth=0 2>/dev/null | head -20
            fi
            ;;
        cargo)
            if [[ -f "Cargo.lock" ]]; then
                echo -e "${CYAN}📊 Cargo Dependencies:${NC}"
                grep -A 1 "^name = " Cargo.lock | head -20
            fi
            ;;
        go)
            if [[ -f "go.sum" ]]; then
                echo -e "${CYAN}📊 Go Modules:${NC}"
                head -10 go.sum
            fi
            ;;
    esac
    
    # Return to original directory
    cd "$original_dir"
}

# Function to handle Prisma-specific updates
handle_prisma_updates() {
    local project_dir="$1"
    
    if [[ -f "$project_dir/prisma/schema.prisma" ]]; then
        log_step "Handling Prisma updates..."
        
        # Regenerate Prisma client with production flags
        if check_tool "npx"; then
            cd "$project_dir"
            npx prisma generate --no-engine
            log_success "Prisma client regenerated with production optimizations"
        fi
        
        # Check for schema changes
        if [[ -n "$(git diff --name-only | grep 'prisma/schema.prisma')" ]]; then
            log_warning "Prisma schema changes detected. Consider running migrations:"
            log_info "  npx prisma migrate dev"
            log_info "  npx prisma db push"
        fi
    fi
}

# Main function
main() {
    echo -e "${PURPLE}🔄 Dependency Updater - Starting automation...${NC}"
    echo ""
    
    # Handle special commands first
    if [[ "$LIST_BACKUPS" == "true" ]]; then
        list_backups
        exit 0
    fi
    
    if [[ "$CLEAN_BACKUPS" == "true" ]]; then
        clean_backups
        exit 0
    fi
    
    if [[ -n "$RESTORE_BACKUP" ]]; then
        restore_backup "$RESTORE_BACKUP"
        exit 0
    fi
    
    # Find project root directory
    log_step "Searching for project files..."
    local project_root
    project_root=$(find_project_root)
    if [[ $? -ne 0 ]]; then
        exit 1
    fi
    
    log_success "Project root found: $project_root"
    
    # Detect package manager if auto
    if [[ "$PACKAGE_MANAGER" == "auto" ]]; then
        log_step "Detecting package manager in: $project_root"
        PACKAGE_MANAGER=$(detect_package_manager "$project_root")
        if [[ -z "$PACKAGE_MANAGER" ]]; then
            log_error "Could not detect package manager in: $project_root"
            log_info "Supported files: package.json, Cargo.toml, go.mod, requirements.txt, composer.json"
            exit 1
        fi
        log_success "Detected package manager: $PACKAGE_MANAGER"
    fi
    
    # Install/check package manager
    if ! install_package_manager "$PACKAGE_MANAGER"; then
        exit 1
    fi
    
    # Create backup (unless dry run)
    local backup_id=""
    if [[ "$DRY_RUN" != "true" ]]; then
        backup_id=$(create_backup "$PACKAGE_MANAGER" "$project_root")
    fi
    
    # Run security audit if enabled
    if [[ "$SECURITY_CHECK" == "true" ]]; then
        run_security_audit "$PACKAGE_MANAGER" "$project_root"
    fi
    
    # Update dependencies
    update_dependencies "$PACKAGE_MANAGER" "$UPDATE_MODE" "$project_root"
    
    # Show summary (unless dry run)
    if [[ "$DRY_RUN" != "true" ]]; then
        show_update_summary "$PACKAGE_MANAGER" "$project_root"
    fi
    
    echo ""
    if [[ "$DRY_RUN" == "true" ]]; then
        log_success "Dry run completed! Use without --dry-run to apply changes."
    else
        log_success "Dependencies updated successfully!"
        log_info "Project root: $project_root"
        log_info "Backup created: $backup_id"
        log_info "To rollback: $0 --restore $backup_id"
    fi
}

# Run main function
main "$@"