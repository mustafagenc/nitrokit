#!/bin/bash

# nitrokit - Comprehensive development toolkit for Nitrokit project

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Version and metadata
NITROKIT_VERSION="1.0.0"
NITROKIT_DESCRIPTION="🚀 Nitrokit Development Toolkit"

# Default configuration
DEFAULT_VERBOSE=false
DEFAULT_DRY_RUN=false
DEFAULT_INTERACTIVE=true
DEFAULT_CONFIG_FILE=""

# Command line parameters
VERBOSE="${VERBOSE:-$DEFAULT_VERBOSE}"
DRY_RUN="${DRY_RUN:-$DEFAULT_DRY_RUN}"
INTERACTIVE="${INTERACTIVE:-$DEFAULT_INTERACTIVE}"
CONFIG_FILE="${CONFIG_FILE:-$DEFAULT_CONFIG_FILE}"

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Available commands
COMMAND_NAMES=("dev" "quality" "translate" "labels" "deps" "changelog" "setup" "status" "clean" "doctor")
COMMAND_DESCRIPTIONS=(
    "🛠️ Development setup and environment management"
    "🔍 Code quality analysis (lint, format, security, tests)"
    "🌍 Translation management and synchronization"
    "🏷️ GitHub repository label management"
    "📦 Dependency management and updates"
    "📝 Changelog and release notes generation"
    "⚙️ Initial project setup and configuration"
    "📊 Project health and status overview"
    "🧹 Clean caches, temp files, and reset state"
    "🩺 Diagnose and fix common issues"
)

# Helper function to get command description
get_command_description() {
    local cmd="$1"
    local i=0
    for name in "${COMMAND_NAMES[@]}"; do
        if [[ "$name" == "$cmd" ]]; then
            echo "${COMMAND_DESCRIPTIONS[$i]}"
            return 0
        fi
        ((i++))
    done
    echo "Unknown command"
    return 1
}

# Helper function to check if command exists
command_exists() {
    local cmd="$1"
    for name in "${COMMAND_NAMES[@]}"; do
        if [[ "$name" == "$cmd" ]]; then
            return 0
        fi
    done
    return 1
}

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${PURPLE}🔄 $1${NC}"; }
log_debug() { [[ "$VERBOSE" == true ]] && echo -e "${CYAN}🔍 $1${NC}"; }
log_header() { echo -e "${BOLD}${BLUE}$1${NC}"; }

# Show banner
show_banner() {
    echo -e "${BOLD}${PURPLE}"
    cat << 'EOF'
    ███╗   ██╗██╗████████╗██████╗  ██████╗ ██╗  ██╗██╗████████╗
    ████╗  ██║██║╚══██╔══╝██╔══██╗██╔═══██╗██║ ██╔╝██║╚══██╔══╝
    ██╔██╗ ██║██║   ██║   ██████╔╝██║   ██║█████╔╝ ██║   ██║   
    ██║╚██╗██║██║   ██║   ██╔══██╗██║   ██║██╔═██╗ ██║   ██║   
    ██║ ╚████║██║   ██║   ██║  ██║╚██████╔╝██║  ██╗██║   ██║   
    ╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝   
EOF
    echo -e "${NC}"
    echo -e "${CYAN}${NITROKIT_DESCRIPTION}${NC}"
    echo -e "${CYAN}Version: ${NITROKIT_VERSION}${NC}"
    echo
}

# Show help - Fixed printf issue
show_help() {
    show_banner
    echo -e "${BOLD}USAGE:${NC}"
    echo "    nitrokit <command> [options]"
    echo "    nitrokit [global-options]"
    echo
    echo -e "${BOLD}COMMANDS:${NC}"
    
    # Use echo -e instead of printf for color codes
    local i=0
    for cmd in "${COMMAND_NAMES[@]}"; do
        echo -e "    ${GREEN}$(printf "%-12s" "$cmd")${NC} ${COMMAND_DESCRIPTIONS[$i]}"
        ((i++))
    done
    
    echo
    echo -e "${BOLD}GLOBAL OPTIONS:${NC}"
    echo "    --verbose, -v        Enable verbose output"
    echo "    --dry-run           Preview changes without executing"
    echo "    --interactive, -i   Interactive mode with prompts"
    echo "    --config FILE       Use custom configuration file"
    echo "    --version           Show version information"
    echo "    --help, -h          Show this help message"
    echo
    echo -e "${BOLD}EXAMPLES:${NC}"
    echo "    nitrokit dev                    # Set up development environment"
    echo "    nitrokit quality --fix          # Run code quality checks with auto-fix"
    echo "    nitrokit translate --ai         # AI-powered translation sync"
    echo "    nitrokit labels --update        # Update GitHub labels"
    echo "    nitrokit deps --check           # Check for dependency updates"
    echo "    nitrokit changelog --generate   # Generate changelog"
    echo "    nitrokit status                 # Show project status"
    echo "    nitrokit doctor                 # Diagnose issues"
    echo
    echo -e "${BOLD}INTERACTIVE MODE:${NC}"
    echo "    nitrokit --interactive          # Launch interactive menu"
    echo "    nitrokit -i                     # Same as above"
    echo
    echo -e "${BOLD}CONFIGURATION:${NC}"
    echo "    Configuration can be stored in:"
    echo "    - .nitrokit.json"
    echo "    - nitrokit.config.js"
    echo "    - package.json (nitrokit section)"
    echo
    echo "For command-specific help, use: nitrokit <command> --help"
}

# Show version
show_version() {
    echo "Nitrokit v${NITROKIT_VERSION}"
    echo "Built for Next.js development workflow automation"
}

# Interactive menu - Fixed printf issue
interactive_menu() {
    show_banner
    log_info "🎯 Interactive Mode"
    echo
    
    while true; do
        echo "📋 Available Commands:"
        local i=0
        for cmd in "${COMMAND_NAMES[@]}"; do
            echo -e "  ${GREEN}$(printf "%2d." "$((i+1))")${NC} $(printf "%-12s" "$cmd") ${COMMAND_DESCRIPTIONS[$i]}"
            ((i++))
        done
        echo -e "  ${GREEN} 0.${NC} Exit"
        echo
        
        read -p "Choose a command (0-${#COMMAND_NAMES[@]}): " choice
        
        if [[ "$choice" == "0" ]]; then
            log_info "👋 Goodbye!"
            exit 0
        elif [[ "$choice" =~ ^[0-9]+$ ]] && [[ $choice -ge 1 ]] && [[ $choice -le ${#COMMAND_NAMES[@]} ]]; then
            local selected_cmd="${COMMAND_NAMES[$((choice-1))]}"
            echo
            log_step "Running: nitrokit $selected_cmd"
            echo
            execute_command "$selected_cmd"
            echo
            read -p "Press Enter to continue..."
            echo
        else
            log_error "Invalid choice. Please try again."
            echo
        fi
    done
}

# Execute command
execute_command() {
    local command="$1"
    shift
    local args=("$@")
    
    case "$command" in
        "dev")
            log_step "🛠️ Setting up development environment..."
            "$SCRIPT_DIR/dev_setup.sh" "${args[@]}"
            ;;
        "quality")
            log_step "🔍 Running code quality analysis..."
            "$SCRIPT_DIR/code_quality.sh" "${args[@]}"
            ;;
        "translate")
            log_step "🌍 Managing translations..."
            if [[ " ${args[*]} " == *" --ai "* ]]; then
                "$SCRIPT_DIR/sync_translations_gemini.sh" "${args[@]}"
            else
                "$SCRIPT_DIR/sync_translations.sh" "${args[@]}"
            fi
            ;;
        "labels")
            log_step "🏷️ Managing GitHub labels..."
            "$SCRIPT_DIR/labels.sh" "${args[@]}"
            ;;
        "deps")
            log_step "📦 Managing dependencies..."
            "$SCRIPT_DIR/dependency_updater.sh" "${args[@]}"
            ;;
        "changelog")
            log_step "📝 Generating changelog..."
            "$SCRIPT_DIR/changelog.sh" "${args[@]}"
            ;;
        "setup")
            log_step "⚙️ Project setup..."
            run_initial_setup "${args[@]}"
            ;;
        "status")
            log_step "📊 Checking project status..."
            run_status_check "${args[@]}"
            ;;
        "clean")
            log_step "🧹 Cleaning project..."
            run_cleanup "${args[@]}"
            ;;
        "doctor")
            log_step "🩺 Running diagnostics..."
            run_doctor "${args[@]}"
            ;;
        *)
            log_error "Unknown command: $command"
            echo "Run 'nitrokit --help' for available commands."
            exit 1
            ;;
    esac
}

# Initial project setup
run_initial_setup() {
    log_header "⚙️ Nitrokit Project Setup"
    echo
    
    # Check if already set up
    if [[ -f "$PROJECT_ROOT/.nitrokit" ]]; then
        log_warning "Project already set up. Use 'nitrokit dev' for development setup."
        return 0
    fi
    
    echo "🚀 Setting up Nitrokit development environment..."
    echo
    
    # Run development setup
    "$SCRIPT_DIR/dev_setup.sh" "$@"
    
    # Set up GitHub labels
    echo
    read -p "Set up GitHub labels? (y/N): " setup_labels
    if [[ "$setup_labels" =~ ^[Yy]$ ]]; then
        "$SCRIPT_DIR/labels.sh" --create
    fi
    
    # Initial dependency check
    echo
    log_step "Checking dependencies..."
    "$SCRIPT_DIR/dependency_updater.sh" --check
    
    # Mark as set up
    echo "nitrokit_setup_complete=$(date)" > "$PROJECT_ROOT/.nitrokit"
    
    echo
    log_success "🎉 Nitrokit setup completed!"
    echo
    echo "Next steps:"
    echo "  • Run 'nitrokit quality' to check code quality"
    echo "  • Run 'nitrokit translate' to manage translations"
    echo "  • Run 'nitrokit status' to see project health"
}

# Project status check
run_status_check() {
    log_header "📊 Nitrokit Project Status"
    echo
    
    cd "$PROJECT_ROOT" || exit 1
    
    # Basic project info
    echo "📁 Project Information:"
    echo "  Path: $PROJECT_ROOT"
    echo "  Name: $(basename "$PROJECT_ROOT")"
    if [[ -f "package.json" ]]; then
        local version=$(grep '"version"' package.json | cut -d'"' -f4 2>/dev/null || echo "unknown")
        echo "  Version: $version"
    fi
    echo
    
    # Git status
    echo "🔄 Git Status:"
    if git rev-parse --git-dir > /dev/null 2>&1; then
        local branch=$(git branch --show-current 2>/dev/null || echo "unknown")
        local commits_ahead=$(git rev-list --count HEAD ^origin/$branch 2>/dev/null || echo "0")
        local commits_behind=$(git rev-list --count origin/$branch ^HEAD 2>/dev/null || echo "0")
        
        echo "  Branch: $branch"
        echo "  Commits ahead: $commits_ahead"
        echo "  Commits behind: $commits_behind"
        
        local status=$(git status --porcelain 2>/dev/null | wc -l || echo "0")
        echo "  Uncommitted changes: $status files"
    else
        echo "  ❌ Not a git repository"
    fi
    echo
    
    # Dependencies status
    echo "📦 Dependencies:"
    if [[ -f "package.json" ]]; then
        local total_deps=$(grep -c '"' package.json | grep -E 'dependencies|devDependencies' | wc -l 2>/dev/null || echo "0")
        echo "  Total packages: checking..."
        
        # Quick dependency check
        if command -v yarn &> /dev/null; then
            yarn list --depth=0 --silent > /tmp/deps_list.txt 2>/dev/null
            local installed_count=$(grep -c "├─\|└─" /tmp/deps_list.txt 2>/dev/null || echo "0")
            echo "  Installed: $installed_count"
        fi
        rm -f /tmp/deps_list.txt
    else
        echo "  ❌ No package.json found"
    fi
    echo
    
    # Quick health checks
    echo "🩺 Health Checks:"
    
    # Node.js version
    if command -v node &> /dev/null; then
        echo "  ✅ Node.js: $(node --version)"
    else
        echo "  ❌ Node.js: Not found"
    fi
    
    # Package manager
    if command -v yarn &> /dev/null; then
        echo "  ✅ Yarn: $(yarn --version)"
    elif command -v npm &> /dev/null; then
        echo "  ✅ npm: $(npm --version)"
    else
        echo "  ❌ Package manager: Not found"
    fi
    
    # TypeScript
    if [[ -f "tsconfig.json" ]]; then
        echo "  ✅ TypeScript: Configured"
    else
        echo "  ⚠️ TypeScript: Not configured"
    fi
    
    # Tests
    if [[ -f "jest.config.ts" ]] || [[ -f "jest.config.js" ]] || grep -q '"jest"' package.json 2>/dev/null; then
        echo "  ✅ Tests: Jest configured"
    else
        echo "  ⚠️ Tests: No test configuration"
    fi
    
    echo
    
    # Recent activity
    echo "📈 Recent Activity (last 7 days):"
    if git rev-parse --git-dir > /dev/null 2>&1; then
        local commits=$(git rev-list --count --since="7 days ago" HEAD 2>/dev/null || echo "0")
        echo "  Commits: $commits"
        
        if [[ $commits -gt 0 ]]; then
            echo "  Recent commits:"
            git log --oneline --since="7 days ago" | head -3 | sed 's/^/    /'
        fi
    fi
    echo
    
    # Quick quality check
    echo "🔍 Quick Quality Check:"
    local issues=0
    
    # Check for common issues
    if [[ -d "node_modules" ]] && [[ ! -f ".gitignore" ]] || ! grep -q "node_modules" .gitignore 2>/dev/null; then
        echo "  ⚠️ node_modules not in .gitignore"
        ((issues++))
    fi
    
    if [[ ! -f "../.env.example" ]] && [[ -f "../.env" ]]; then
        echo "  ⚠️ .env exists but no .env.example"
        ((issues++))
    fi
    
    local console_logs=$(find ../src/ -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -c "console\.log" 2>/dev/null | awk '{sum+=$1} END {print sum+0}' || echo "0")
    if [[ $console_logs -gt 0 ]]; then
        echo "  ⚠️ $console_logs console.log statements found"
        ((issues++))
    fi
    
    if [[ $issues -eq 0 ]]; then
        echo "  ✅ No obvious issues found"
    else
        echo "  📋 Run 'nitrokit doctor' for detailed analysis"
    fi
    
    echo
    log_info "💡 Use 'nitrokit quality' for comprehensive code analysis"
}

# Cleanup function
run_cleanup() {
    log_header "🧹 Nitrokit Cleanup"
    echo
    
    cd "$PROJECT_ROOT" || exit 1
    
    local cleaned=false
    
    # Node modules cleanup
    if [[ -d "node_modules" ]]; then
        echo -n "🗑️ Remove node_modules? (y/N): "
        read -r clean_modules
        if [[ "$clean_modules" =~ ^[Yy]$ ]]; then
            rm -rf node_modules
            log_success "Removed node_modules"
            cleaned=true
        fi
    fi
    
    # Cache cleanup
    echo -n "🧹 Clean caches? (Y/n): "
    read -r clean_cache
    if [[ ! "$clean_cache" =~ ^[Nn]$ ]]; then
        # Yarn cache
        if command -v yarn &> /dev/null; then
            yarn cache clean
            log_success "Cleaned yarn cache"
        fi
        
        # npm cache
        if command -v npm &> /dev/null; then
            npm cache clean --force
            log_success "Cleaned npm cache"
        fi
        
        # Next.js cache
        if [[ -d ".next" ]]; then
            rm -rf .next
            log_success "Cleaned Next.js build cache"
        fi
        
        cleaned=true
    fi
    
    # Temp files cleanup
    echo -n "🗂️ Clean temporary files? (Y/n): "
    read -r clean_temp
    if [[ ! "$clean_temp" =~ ^[Nn]$ ]]; then
        find . -name "*.log" -type f -delete 2>/dev/null
        find . -name ".DS_Store" -type f -delete 2>/dev/null
        find /tmp -name "*nitrokit*" -type f -delete 2>/dev/null
        log_success "Cleaned temporary files"
        cleaned=true
    fi
    
    if [[ "$cleaned" == true ]]; then
        echo
        log_success "🎉 Cleanup completed!"
        echo "💡 Run 'nitrokit dev' to reinstall dependencies"
    else
        log_info "No cleanup performed"
    fi
}

# Doctor function
run_doctor() {
    log_header "🩺 Nitrokit Doctor"
    echo
    
    cd "$PROJECT_ROOT" || exit 1
    
    local issues=0
    local warnings=0
    
    log_step "Running comprehensive diagnostics..."
    echo
    
    # Check Node.js version
    echo "🟢 Node.js Version:"
    if command -v node &> /dev/null; then
        local node_version=$(node --version | sed 's/v//')
        local major_version=$(echo "$node_version" | cut -d. -f1)
        
        if [[ $major_version -ge 18 ]]; then
            echo "  ✅ Node.js $node_version (supported)"
        elif [[ $major_version -ge 16 ]]; then
            echo "  ⚠️ Node.js $node_version (works but upgrade recommended)"
            ((warnings++))
        else
            echo "  ❌ Node.js $node_version (unsupported, upgrade required)"
            ((issues++))
        fi
    else
        echo "  ❌ Node.js not found"
        ((issues++))
    fi
    echo
    
    # Check package manager
    echo "📦 Package Manager:"
    if command -v yarn &> /dev/null; then
        echo "  ✅ Yarn $(yarn --version)"
    elif command -v npm &> /dev/null; then
        echo "  ✅ npm $(npm --version)"
    else
        echo "  ❌ No package manager found"
        ((issues++))
    fi
    echo
    
    # Check project structure
    echo "📁 Project Structure:"
    local required_files=("package.json" "tsconfig.json" "next.config.js")
    for file in "${required_files[@]}"; do
        if [[ -f "$file" ]]; then
            echo "  ✅ $file"
        else
            echo "  ⚠️ $file missing"
            ((warnings++))
        fi
    done
    echo
    
    # Check dependencies
    echo "📚 Dependencies:"
    if [[ -f "package.json" ]]; then
        if [[ -f "yarn.lock" ]] || [[ -f "package-lock.json" ]]; then
            echo "  ✅ Lock file present"
        else
            echo "  ⚠️ No lock file found"
            ((warnings++))
        fi
        
        if [[ -d "node_modules" ]]; then
            echo "  ✅ Dependencies installed"
        else
            echo "  ❌ Dependencies not installed"
            ((issues++))
        fi
    fi
    echo
    
    # Check Git
    echo "🔄 Git Repository:"
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo "  ✅ Git repository initialized"
        
        if [[ -f ".gitignore" ]]; then
            echo "  ✅ .gitignore present"
            
            local ignore_items=("node_modules" ".env" ".next")
            for item in "${ignore_items[@]}"; do
                if grep -q "$item" .gitignore; then
                    echo "  ✅ $item in .gitignore"
                else
                    echo "  ⚠️ $item not in .gitignore"
                    ((warnings++))
                fi
            done
        else
            echo "  ⚠️ .gitignore missing"
            ((warnings++))
        fi
    else
        echo "  ❌ Not a git repository"
        ((issues++))
    fi
    echo
    
    # Check environment
    echo "🌍 Environment:"
    if [[ -f ".env.example" ]]; then
        echo "  ✅ .env.example present"
    else
        echo "  ⚠️ .env.example missing"
        ((warnings++))
    fi
    
    if [[ -f ".env" ]]; then
        echo "  ✅ .env present"
    else
        echo "  ⚠️ .env missing"
        ((warnings++))
    fi
    echo
    
    # Summary and recommendations
    echo "📋 Summary:"
    echo "  Issues: $issues"
    echo "  Warnings: $warnings"
    echo
    
    if [[ $issues -eq 0 ]] && [[ $warnings -eq 0 ]]; then
        log_success "🎉 All checks passed! Your project is healthy."
    elif [[ $issues -eq 0 ]]; then
        log_warning "⚠️ Some warnings found, but project should work fine."
    else
        log_error "❌ Critical issues found that need attention."
    fi
    
    echo
    echo "🛠️ Recommended actions:"
    if [[ $issues -gt 0 ]]; then
        echo "  1. Fix critical issues above"
        echo "  2. Run 'nitrokit dev' to set up development environment"
    fi
    if [[ $warnings -gt 0 ]]; then
        echo "  3. Address warnings for better project health"
    fi
    echo "  4. Run 'nitrokit quality' for code analysis"
    echo "  5. Run 'nitrokit status' for ongoing monitoring"
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --verbose|-v)
                VERBOSE=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --interactive|-i)
                INTERACTIVE=true
                shift
                ;;
            --config)
                CONFIG_FILE="$2"
                shift 2
                ;;
            --version)
                show_version
                exit 0
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                # First non-option argument is the command
                if ! command_exists "$COMMAND"; then
                    log_error "Unknown command: $COMMAND"
                    echo "Available commands: ${COMMAND_NAMES[*]}"
                    exit 1
                fi
                ;;
        esac
    done
}

# Main function
main() {
    # Change to project root
    cd "$PROJECT_ROOT" || exit 1
    
    # Parse arguments
    parse_args "$@"
    
    # Load configuration if exists
    if [[ -f ".nitrokit.json" ]] && command -v jq &> /dev/null; then
        log_debug "Loading configuration from .nitrokit.json"
        # Load config logic here
    fi
    
    # Handle interactive mode
    if [[ "$INTERACTIVE" == true ]]; then
        interactive_menu
        exit 0
    fi
    
    # Handle no command
    if [[ -z "${COMMAND:-}" ]]; then
        show_help
        exit 1
    fi
    
    # Validate command
    if [[ ! "${COMMANDS[$COMMAND]+isset}" ]]; then
        log_error "Unknown command: $COMMAND"
        echo "Available commands: ${!COMMANDS[*]}"
        exit 1
    fi
    
    # Execute command
    execute_command "$COMMAND" "${COMMAND_ARGS[@]}"
}

# Run main function
main "$@"