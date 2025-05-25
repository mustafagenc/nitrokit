#!/bin/bash

# code_quality.sh - Linting, formatting, and security scanning

# Get project root relative to shell directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default configuration
DEFAULT_FIX=false
DEFAULT_VERBOSE=false
DEFAULT_STRICT=false
DEFAULT_SKIP_DEPS=false
DEFAULT_OUTPUT_FORMAT="console"
DEFAULT_FAIL_ON_WARNINGS=false

# Command line parameters
FIX="${FIX:-$DEFAULT_FIX}"
VERBOSE="${VERBOSE:-$DEFAULT_VERBOSE}"
STRICT="${STRICT:-$DEFAULT_STRICT}"
SKIP_DEPS="${SKIP_DEPS:-$DEFAULT_SKIP_DEPS}"
OUTPUT_FORMAT="${OUTPUT_FORMAT:-$DEFAULT_OUTPUT_FORMAT}"
FAIL_ON_WARNINGS="${FAIL_ON_WARNINGS:-$DEFAULT_FAIL_ON_WARNINGS}"
ONLY=""
EXCLUDE=""
CONFIG_FILE=""

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Progress tracking - Fixed for older Bash versions

# Yeni (uyumlu):
RESULTS_KEYS=()
RESULTS_VALUES=()
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Helper functions for results storage
store_result() {
    local key="$1"
    local value="$2"
    
    # Check if key already exists
    local i=0
    for existing_key in "${RESULTS_KEYS[@]}"; do
        if [[ "$existing_key" == "$key" ]]; then
            RESULTS_VALUES[$i]="$value"
            return
        fi
        ((i++))
    done
    
    # Add new key-value pair
    RESULTS_KEYS+=("$key")
    RESULTS_VALUES+=("$value")
}

get_result() {
    local key="$1"
    local i=0
    for existing_key in "${RESULTS_KEYS[@]}"; do
        if [[ "$existing_key" == "$key" ]]; then
            echo "${RESULTS_VALUES[$i]}"
            return
        fi
        ((i++))
    done
    echo ""
}

# Help function
show_help() {
    cat << EOF
🔍 Code Quality Scanner - Comprehensive code analysis and security scanning

USAGE:
    ./code_quality.sh [OPTIONS]

DESCRIPTION:
    Runs comprehensive code quality checks including linting, formatting,
    type checking, security scanning, and dependency auditing.

OPTIONS:
    --fix                    Automatically fix issues where possible
    --verbose               Show detailed output for all checks
    --strict                Enable strict mode (treat warnings as errors)
    --skip-deps             Skip dependency checks and installations
    --only CHECKS           Run only specific checks (comma-separated)
    --exclude CHECKS        Exclude specific checks (comma-separated)
    --output FORMAT         Output format: console, json, html (default: console)
    --config FILE           Use custom configuration file
    --fail-on-warnings      Exit with non-zero code on warnings
    -h, --help              Show this help message and exit

AVAILABLE CHECKS:
    lint                    ESLint JavaScript/TypeScript linting
    format                  Prettier code formatting
    types                   TypeScript type checking
    security                Security vulnerability scanning
    deps                    Dependency audit and outdated packages
    duplicates              Duplicate code detection
    complexity              Code complexity analysis
    performance             Performance and bundle size analysis
    accessibility           Accessibility checks
    tests                   Test coverage and quality
    git                     Git hooks and commit message validation
    docker                  Dockerfile and container security

EXAMPLES:
    ./code_quality.sh                                    # Run all checks
    ./code_quality.sh --fix                             # Run all checks with auto-fix
    ./code_quality.sh --only lint,format,types          # Run specific checks
    ./code_quality.sh --exclude security,deps           # Exclude specific checks
    ./code_quality.sh --strict --fail-on-warnings       # Strict mode
    ./code_quality.sh --output json > quality-report.json  # JSON output
    ./code_quality.sh --verbose --config .quality.json  # Custom config

CONFIGURATION:
    Create .quality.json in project root for custom configuration:
    {
        "eslint": { "fix": true, "extensions": ["ts", "tsx"] },
        "prettier": { "write": true, "check": false },
        "typescript": { "strict": true, "noEmit": true },
        "security": { "audit": true, "scan": true },
        "thresholds": {
            "coverage": 80,
            "complexity": 10,
            "bundleSize": "500kb"
        }
    }

EOF
}

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${PURPLE}🔄 $1${NC}"; }
log_debug() { [[ "$VERBOSE" == true ]] && echo -e "${CYAN}🔍 $1${NC}"; }

# Progress functions
start_check() {
    local check_name="$1"
    ((TOTAL_CHECKS++))
    log_step "Running $check_name..."
}

pass_check() {
    local check_name="$1"
    local message="${2:-Passed}"
    ((PASSED_CHECKS++))
    store_result "$check_name" "PASS:$message"
    log_success "$check_name: $message"
}

fail_check() {
    local check_name="$1"
    local message="${2:-Failed}"
    ((FAILED_CHECKS++))
    store_result "$check_name" "FAIL:$message"
    log_error "$check_name: $message"
}

warn_check() {
    local check_name="$1"
    local message="${2:-Warning}"
    ((WARNING_CHECKS++))
    store_result "$check_name" "WARN:$message"
    log_warning "$check_name: $message"
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --fix)
                FIX=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --strict)
                STRICT=true
                shift
                ;;
            --skip-deps)
                SKIP_DEPS=true
                shift
                ;;
            --only)
                ONLY="$2"
                shift 2
                ;;
            --exclude)
                EXCLUDE="$2"
                shift 2
                ;;
            --output)
                OUTPUT_FORMAT="$2"
                shift 2
                ;;
            --config)
                CONFIG_FILE="$2"
                shift 2
                ;;
            --fail-on-warnings)
                FAIL_ON_WARNINGS=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# Check if command should run
should_run_check() {
    local check_name="$1"
    
    # If ONLY is specified, only run those checks
    if [[ -n "$ONLY" ]]; then
        [[ ",$ONLY," == *",$check_name,"* ]]
        return $?
    fi
    
    # If EXCLUDE is specified, skip those checks
    if [[ -n "$EXCLUDE" ]]; then
        [[ ",$EXCLUDE," != *",$check_name,"* ]]
        return $?
    fi
    
    return 0
}

# Check dependencies - Progress indicators added
check_dependencies() {
    if [[ "$SKIP_DEPS" == true ]]; then
        log_info "Skipping dependency checks"
        return 0
    fi
    
    log_step "Checking dependencies..."
    
    local missing_tools=()
    
    # Check for essential tools with progress
    echo -n "🔍 Checking Node.js... "
    if ! command -v node &> /dev/null; then
        missing_tools+=("node")
        echo "❌ Missing"
    else
        echo "✅ Found ($(node --version))"
    fi
    
    echo -n "🔍 Checking package manager... "
    if ! command -v yarn &> /dev/null && ! command -v npm &> /dev/null; then
        missing_tools+=("yarn or npm")
        echo "❌ Missing"
    else
        if command -v yarn &> /dev/null; then
            echo "✅ Found yarn ($(yarn --version))"
        else
            echo "✅ Found npm ($(npm --version))"
        fi
    fi
    
    # Check for additional tools
    local tools=(
        "jq:JSON processor"
        "git:Version control"
    )
    
    for tool_info in "${tools[@]}"; do
        IFS=':' read -r tool desc <<< "$tool_info"
        echo -n "🔍 Checking $tool... "
        if ! command -v "$tool" &> /dev/null; then
            echo "⚠️ Optional ($desc)"
            log_debug "Optional tool missing: $tool ($desc)"
        else
            echo "✅ Found"
        fi
    done
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        return 1
    fi
    
    # Install/update project dependencies with live progress
    if [[ -f "$PROJECT_ROOT/package.json" ]]; then
        echo -n "📦 Installing dependencies... "
        cd "$PROJECT_ROOT" || exit 1
        
        # Add timeout and better error handling
        local install_cmd=""
        local install_timeout=180  # Reduced to 3 minutes
        
        if command -v yarn &> /dev/null; then
            # Check if yarn.lock exists to determine install strategy
            if [[ -f "yarn.lock" ]]; then
                install_cmd="yarn install --frozen-lockfile --silent --non-interactive"
            else
                install_cmd="yarn install --silent --non-interactive"
            fi
        else
            # Check if package-lock.json exists
            if [[ -f "package-lock.json" ]]; then
                install_cmd="npm ci --silent --no-audit --no-fund"
            else
                install_cmd="npm install --silent --no-audit --no-fund"
            fi
        fi
        
        # Show what we're running
        echo "($install_cmd)"
        echo -n "⏳ Progress: "
        
        # Run with timeout and show progress dots
        (
            $install_cmd > /tmp/install_output.txt 2>&1 &
            local install_pid=$!
            local counter=0
            
            while kill -0 $install_pid 2>/dev/null; do
                echo -n "."
                sleep 2
                ((counter++))
                
                # Show status every 10 dots (20 seconds)
                if (( counter % 10 == 0 )); then
                    echo -n " (${counter}0s) "
                fi
                
                # Timeout check
                if (( counter > install_timeout/2 )); then
                    kill $install_pid 2>/dev/null
                    echo " ❌ Timeout after ${install_timeout}s"
                    return 1
                fi
            done
            
            wait $install_pid
            return $?
        )
        
        local install_result=$?
        
        if [[ $install_result -eq 0 ]]; then
            echo " ✅ Success"
            log_debug "Dependencies installed successfully"
        else
            echo " ❌ Failed"
            log_warning "Dependency installation failed (exit code: $install_result)"
            
            # Show last few lines of error
            if [[ -f /tmp/install_output.txt ]]; then
                echo "📋 Last few lines of output:"
                tail -5 /tmp/install_output.txt | sed 's/^/   /'
            fi
            
            echo "💡 Try running manually: $install_cmd"
            echo "⏭️ Continuing with existing dependencies..."
        fi
        
        # Cleanup
        rm -f /tmp/install_output.txt
    else
        echo "📦 No package.json found, skipping dependency installation"
    fi
    
    echo "✅ Dependency check completed"
    return 0
}

# ESLint check - Fixed version
check_lint() {
    should_run_check "lint" || return 0
    start_check "ESLint"
    
    cd "$PROJECT_ROOT" || exit 1
    
    local eslint_cmd="npx eslint"
    local eslint_args="src/ --ext .ts,.tsx,.js,.jsx"
    
    if [[ "$FIX" == true ]]; then
        eslint_args="$eslint_args --fix"
    fi
    
    if [[ "$OUTPUT_FORMAT" == "json" ]]; then
        eslint_args="$eslint_args --format json"
    fi
    
    log_debug "Running: $eslint_cmd $eslint_args"
    
    if $eslint_cmd $eslint_args > /tmp/eslint_output.txt 2>&1; then
        pass_check "lint" "No linting errors found"
    else
        # Fixed: Properly extract numbers and handle empty results
        local error_count=$(grep -c "error" /tmp/eslint_output.txt 2>/dev/null || echo "0")
        local warning_count=$(grep -c "warning" /tmp/eslint_output.txt 2>/dev/null || echo "0")
        
        # Clean up any whitespace and ensure we have valid numbers
        error_count=$(echo "$error_count" | tr -d '[:space:]' | grep -E '^[0-9]+$' || echo "0")
        warning_count=$(echo "$warning_count" | tr -d '[:space:]' | grep -E '^[0-9]+$' || echo "0")
        
        if [[ "$VERBOSE" == true ]]; then
            cat /tmp/eslint_output.txt
        fi
        
        if [[ $error_count -gt 0 ]]; then
            fail_check "lint" "$error_count error(s), $warning_count warning(s)"
        elif [[ $warning_count -gt 0 ]]; then
            if [[ "$STRICT" == true ]]; then
                fail_check "lint" "$warning_count warning(s) in strict mode"
            else
                warn_check "lint" "$warning_count warning(s)"
            fi
        fi
    fi
}

# Prettier check - Show which files need formatting
check_format() {
    should_run_check "format" || return 0
    start_check "Prettier"
    
    cd "$PROJECT_ROOT" || exit 1
    
    local prettier_cmd="npx prettier"
    local prettier_args="src/ --check"
    
    if [[ "$FIX" == true ]]; then
        prettier_args="src/ --write"
    fi
    
    log_debug "Running: $prettier_cmd $prettier_args"
    
    if $prettier_cmd $prettier_args > /tmp/prettier_output.txt 2>&1; then
        if [[ "$FIX" == true ]]; then
            pass_check "format" "Code formatted successfully"
        else
            pass_check "format" "Code is properly formatted"
        fi
    else
        local file_count=$(wc -l < /tmp/prettier_output.txt 2>/dev/null || echo "0")
        
        # Show which files need formatting
        if [[ "$VERBOSE" == true ]] || [[ $file_count -gt 0 ]]; then
            echo "📋 Files needing formatting:"
            cat /tmp/prettier_output.txt | head -10 | sed 's/^/   /'
            if [[ $file_count -gt 10 ]]; then
                echo "   ... and $((file_count - 10)) more files"
            fi
        fi
        
        if [[ "$FIX" == true ]]; then
            warn_check "format" "Fixed formatting in $file_count file(s)"
        else
            fail_check "format" "$file_count file(s) need formatting"
        fi
    fi
}

# TypeScript check
check_types() {
    should_run_check "types" || return 0
    start_check "TypeScript"
    
    cd "$PROJECT_ROOT" || exit 1
    
    if [[ ! -f "tsconfig.json" ]]; then
        warn_check "types" "No tsconfig.json found, skipping"
        return 0
    fi
    
    local tsc_cmd="npx tsc --noEmit"
    
    log_debug "Running: $tsc_cmd"
    
    if $tsc_cmd > /tmp/tsc_output.txt 2>&1; then
        pass_check "types" "No type errors found"
    else
        local error_count=$(grep -c "error TS" /tmp/tsc_output.txt 2>/dev/null || echo "0")
        
        if [[ "$VERBOSE" == true ]]; then
            cat /tmp/tsc_output.txt
        fi
        
        fail_check "types" "$error_count type error(s)"
    fi
}

# Security check - Show detailed issues
check_security() {
    should_run_check "security" || return 0
    start_check "Security"
    
    cd "$PROJECT_ROOT" || exit 1
    
    local issues_found=0
    local security_details=()
    
    # Dependency audit with details
    echo -n "🔍 Dependency audit... "
    if command -v yarn &> /dev/null; then
        if ! yarn audit --level moderate > /tmp/audit_output.txt 2>&1; then
            local audit_issues=$(grep -c "vulnerability" /tmp/audit_output.txt 2>/dev/null || echo "0")
            if [[ $audit_issues -gt 0 ]]; then
                ((issues_found++))
                security_details+=("$audit_issues dependency vulnerabilities")
                echo "❌ Found $audit_issues vulnerabilities"
                if [[ "$VERBOSE" == true ]]; then
                    echo "📋 Vulnerability details:"
                    grep -A2 -B2 "vulnerability\|severity" /tmp/audit_output.txt | head -20 | sed 's/^/   /'
                fi
            fi
        else
            echo "✅ Clean"
        fi
    else
        if ! npm audit --audit-level moderate > /tmp/audit_output.txt 2>&1; then
            local audit_issues=$(grep -c "vulnerabilities" /tmp/audit_output.txt 2>/dev/null || echo "0")
            if [[ $audit_issues -gt 0 ]]; then
                ((issues_found++))
                security_details+=("$audit_issues dependency vulnerabilities")
                echo "❌ Found vulnerabilities"
                if [[ "$VERBOSE" == true ]]; then
                    echo "📋 Vulnerability details:"
                    tail -10 /tmp/audit_output.txt | sed 's/^/   /'
                fi
            fi
        else
            echo "✅ Clean"
        fi
    fi
    
    # Check for common security issues with details
    echo -n "🔍 Code security patterns... "
    local security_patterns=(
        "console\.log:Console logs (remove in production)"
        "eval\s*\(:Eval usage (dangerous)"
        "innerHTML\s*=:innerHTML usage (XSS risk)"
        "document\.write:Document.write usage (XSS risk)"
        "localStorage\.setItem.*password:Password in localStorage"
        "sessionStorage\.setItem.*password:Password in sessionStorage"
    )
    
    local pattern_issues=0
    for pattern_info in "${security_patterns[@]}"; do
        IFS=':' read -r pattern desc <<< "$pattern_info"
        local matches=$(grep -r -E "$pattern" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l || echo "0")
        if [[ $matches -gt 0 ]]; then
            ((pattern_issues++))
            security_details+=("$matches instances of $desc")
            if [[ "$VERBOSE" == true ]]; then
                echo "📋 $desc found in:"
                grep -r -E "$pattern" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | head -5 | sed 's/^/   /'
                [[ $matches -gt 5 ]] && echo "   ... and $((matches - 5)) more"
            fi
        fi
    done
    
    issues_found=$((issues_found + pattern_issues))
    
    if [[ $pattern_issues -eq 0 ]]; then
        echo "✅ Clean"
    else
        echo "❌ Found $pattern_issues pattern types"
    fi
    
    if [[ $issues_found -eq 0 ]]; then
        pass_check "security" "No security issues found"
    else
        local details_msg=$(IFS=', '; echo "${security_details[*]}")
        fail_check "security" "$details_msg"
    fi
}

# Dependency check - Fixed with better error handling
check_deps() {
    should_run_check "deps" || return 0
    start_check "Dependencies"
    
    cd "$PROJECT_ROOT" || exit 1
    
    local total_issues=0
    
    # Check for outdated packages with timeout
    echo -n "🔍 Checking outdated packages... "
    local outdated_count=0
    
    if command -v yarn &> /dev/null; then
        # Use timeout to prevent hanging
        if timeout 30 yarn outdated --json > /tmp/outdated_output.txt 2>/dev/null; then
            if command -v jq &> /dev/null; then
                outdated_count=$(jq '.data.body | length' < /tmp/outdated_output.txt 2>/dev/null || echo "0")
            else
                # Fallback without jq
                outdated_count=$(grep -c "workspace" /tmp/outdated_output.txt 2>/dev/null || echo "0")
            fi
        else
            outdated_count="0"
        fi
    else
        if timeout 30 npm outdated --json > /tmp/outdated_output.txt 2>/dev/null; then
            if command -v jq &> /dev/null; then
                outdated_count=$(jq 'keys | length' < /tmp/outdated_output.txt 2>/dev/null || echo "0")
            else
                # Fallback without jq
                outdated_count=$(grep -c '"' /tmp/outdated_output.txt 2>/dev/null || echo "0")
            fi
        else
            outdated_count="0"
        fi
    fi
    
    # Ensure it's a valid number
    [[ ! "$outdated_count" =~ ^[0-9]+$ ]] && outdated_count=0
    echo "Found: $outdated_count"
    
    # Check for unused dependencies with timeout
    echo -n "🔍 Checking unused dependencies... "
    local unused_count=0
    
    if command -v npx &> /dev/null; then
        if timeout 60 npx depcheck --json > /tmp/depcheck_output.txt 2>/dev/null; then
            if command -v jq &> /dev/null; then
                unused_count=$(jq '.dependencies | length' < /tmp/depcheck_output.txt 2>/dev/null || echo "0")
            else
                # Fallback without jq
                unused_count=$(grep -c '"' /tmp/depcheck_output.txt 2>/dev/null || echo "0")
            fi
        else
            unused_count="0"
        fi
    fi
    
    # Ensure it's a valid number
    [[ ! "$unused_count" =~ ^[0-9]+$ ]] && unused_count=0
    echo "Found: $unused_count"
    
    total_issues=$((outdated_count + unused_count))
    
    if [[ $total_issues -eq 0 ]]; then
        pass_check "deps" "Dependencies are up to date"
    elif [[ $total_issues -lt 5 ]]; then
        warn_check "deps" "$outdated_count outdated, $unused_count unused"
    else
        fail_check "deps" "$outdated_count outdated, $unused_count unused"
    fi
    
    # Cleanup
    rm -f /tmp/outdated_output.txt /tmp/depcheck_output.txt
}

# Duplicate code detection - Fixed to avoid false positives
check_duplicates() {
    should_run_check "duplicates" || return 0
    start_check "Duplicate Code"
    
    cd "$PROJECT_ROOT" || exit 1
    
    local duplicate_count=0
    local duplicate_details=()
    
    # Check for actual duplicate code blocks (not just imports)
    echo -n "🔍 Duplicate code blocks... "
    
    # Find files with similar content (excluding imports and common patterns)
    local code_duplicates=0
    if command -v sort &> /dev/null && command -v uniq &> /dev/null; then
        # Look for duplicate function signatures
        code_duplicates=$(find src/ app/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | \
            xargs grep -h "^export function\|^function\|^const.*=.*=>" 2>/dev/null | \
            grep -v "^import\|^//" | \
            sort | uniq -d | wc -l || echo "0")
    fi
    
    if [[ $code_duplicates -gt 0 ]]; then
        duplicate_count=$((duplicate_count + code_duplicates))
        duplicate_details+=("$code_duplicates duplicate function signatures")
        echo "❌ Found $code_duplicates"
        if [[ "$VERBOSE" == true ]]; then
            echo "📋 Duplicate function signatures:"
            find src/ app/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | \
                xargs grep -h "^export function\|^function\|^const.*=.*=>" 2>/dev/null | \
                grep -v "^import\|^//" | sort | uniq -d | head -5 | sed 's/^/   /'
        fi
    else
        echo "✅ Clean"
    fi
    
    # Check for duplicate utility functions (more specific)
    echo -n "🔍 Duplicate utility patterns... "
    local util_duplicates=0
    
    # Look for actual duplicate utility function implementations
    if [[ -d "src/utils" || -d "src/lib" ]]; then
        util_duplicates=$(find src/utils src/lib -name "*.ts" -o -name "*.js" 2>/dev/null | \
            xargs grep -l "export.*function\|export.*const.*=" 2>/dev/null | \
            xargs grep -h "export.*function\|export.*const.*=" 2>/dev/null | \
            sort | uniq -d | wc -l || echo "0")
    fi
    
    if [[ $util_duplicates -gt 0 ]]; then
        duplicate_count=$((duplicate_count + util_duplicates))
        duplicate_details+=("$util_duplicates duplicate utility functions")
        echo "❌ Found $util_duplicates"
    else
        echo "✅ Clean"
    fi
    
    # Check for copy-pasted components (large code blocks)
    echo -n "🔍 Similar component structures... "
    local component_duplicates=0
    
    # This is a more sophisticated check - look for files with very similar structure
    if command -v wc &> /dev/null; then
        # Simple heuristic: files with same line count and similar export patterns
        component_duplicates=$(find src/components -name "*.tsx" 2>/dev/null | \
            while read -r file; do
                lines=$(wc -l < "$file" 2>/dev/null || echo "0")
                exports=$(grep -c "^export" "$file" 2>/dev/null || echo "0")
                echo "$lines:$exports:$file"
            done | sort | uniq -d -f2 | wc -l || echo "0")
    fi
    
    if [[ $component_duplicates -gt 0 ]]; then
        duplicate_count=$((duplicate_count + component_duplicates))
        duplicate_details+=("$component_duplicates potentially similar components")
        echo "⚠️ Found $component_duplicates (review needed)"
    else
        echo "✅ Clean"
    fi
    
    # Don't count common imports as duplicates
    echo "💡 Note: Common imports (React, Next.js, Radix) are expected across components"
    
    if [[ $duplicate_count -eq 0 ]]; then
        pass_check "duplicates" "No concerning duplicates found"
    elif [[ $duplicate_count -lt 5 ]]; then
        local details_msg=$(IFS=', '; echo "${duplicate_details[*]}")
        warn_check "duplicates" "$details_msg"
    else
        local details_msg=$(IFS=', '; echo "${duplicate_details[*]}")
        fail_check "duplicates" "$details_msg"
    fi
}

# Advanced duplicate detection using jscpd (if available)
check_duplicates_advanced() {
    should_run_check "duplicates" || return 0
    start_check "Duplicate Code"
    
    cd "$PROJECT_ROOT" || exit 1
    
    # Try to use jscpd if available
    if command -v npx &> /dev/null; then
        echo -n "🔍 Running jscpd analysis... "
        if npx jscpd src/ --min-lines 5 --min-tokens 50 --format "json" --output /tmp/jscpd_output.json > /dev/null 2>&1; then
            if [[ -f /tmp/jscpd_output.json ]] && command -v jq &> /dev/null; then
                local duplicate_count=$(jq '.statistics.total.duplicates' /tmp/jscpd_output.json 2>/dev/null || echo "0")
                local duplicate_files=$(jq '.statistics.total.files' /tmp/jscpd_output.json 2>/dev/null || echo "0")
                
                if [[ $duplicate_count -gt 0 ]]; then
                    echo "❌ Found $duplicate_count duplicates in $duplicate_files files"
                    if [[ "$VERBOSE" == true ]]; then
                        echo "📋 Duplicate details:"
                        jq -r '.duplicates[] | "   \(.firstFile.name):\(.firstFile.start) <-> \(.secondFile.name):\(.secondFile.start)"' /tmp/jscpd_output.json 2>/dev/null | head -5
                    fi
                    warn_check "duplicates" "$duplicate_count code duplicates found"
                else
                    echo "✅ Clean"
                    pass_check "duplicates" "No significant code duplication"
                fi
            else
                echo "⚠️ Analysis completed"
                warn_check "duplicates" "Could not parse duplicate analysis results"
            fi
            rm -f /tmp/jscpd_output.json
        else
            # Fallback to simple check
            echo "⚠️ Using basic analysis"
            check_duplicates_simple
        fi
    else
        check_duplicates_simple
    fi
}

# Simple fallback duplicate check
check_duplicates_simple() {
    local duplicate_count=0
    
    echo -n "🔍 Basic duplicate analysis... "
    
    # Only check for actual problematic duplicates
    # 1. Identical function implementations
    local func_duplicates=$(find src/ -name "*.ts" -o -name "*.tsx" 2>/dev/null | \
        xargs sed -i '' 's/console\.log/\/\/ console.log/g' 2>/dev/null | \
        xargs grep -A5 "^export function\|^function" 2>/dev/null | \
        grep -v "^--$\|^import\|fileName" | \
        sort | uniq -d | wc -l || echo "0")
    
    duplicate_count=$((duplicate_count + func_duplicates))
    
    if [[ $duplicate_count -eq 0 ]]; then
        echo "✅ Clean"
        pass_check "duplicates" "No problematic duplicates found"
    else
        echo "⚠️ Found $duplicate_count potential issues"
        warn_check "duplicates" "$duplicate_count potential duplicate functions (review needed)"
    fi
}

# Test coverage check - Fixed for decimal numbers
check_tests() {
    should_run_check "tests" || return 0
    start_check "Tests"
    
    cd "$PROJECT_ROOT" || exit 1
    
    # Check for various test configurations
    local test_configs=(
        "jest.config.js"
        "jest.config.ts"
        "jest.config.json"
        "package.json"
    )
    
    local has_jest=false
    local config_file=""
    
    for config in "${test_configs[@]}"; do
        if [[ -f "$config" ]]; then
            if [[ "$config" == "package.json" ]]; then
                if grep -q '"jest"' package.json 2>/dev/null; then
                    has_jest=true
                    config_file="package.json (jest config)"
                    break
                fi
            else
                has_jest=true
                config_file="$config"
                break
            fi
        fi
    done
    
    if [[ "$has_jest" == true ]]; then
        echo "📋 Found Jest configuration: $config_file"
        log_debug "Running Jest tests with coverage..."
        
        if npx jest --coverage --silent --passWithNoTests > /tmp/test_output.txt 2>&1; then
            local coverage=$(grep "All files" /tmp/test_output.txt | awk '{print $10}' | sed 's/%//' 2>/dev/null || echo "0")
            local test_count=$(grep -c "PASS\|FAIL" /tmp/test_output.txt 2>/dev/null || echo "0")
            
            # Convert decimal to integer for comparison (multiply by 100)
            local coverage_int=$(echo "$coverage" | awk '{printf "%.0f", $1 * 100}' 2>/dev/null || echo "0")
            
            if [[ "$VERBOSE" == true ]]; then
                echo "📋 Test summary:"
                grep "Tests:\|Suites:" /tmp/test_output.txt | sed 's/^/   /' || echo "   No test summary available"
            fi
            
            # Compare using integer values (80% = 8000, 60% = 6000)
            if [[ $coverage_int -ge 7500 ]]; then   # 75%+
                pass_check "tests" "Good coverage: ${coverage}% ($test_count test files)"
            elif [[ $coverage_int -ge 6000 ]]; then  # 60%+
                warn_check "tests" "Moderate coverage: ${coverage}% ($test_count test files)"
            else                                      # <60%
                fail_check "tests" "Low coverage: ${coverage}% ($test_count test files)"
            fi
        else
            fail_check "tests" "Tests failed"
            if [[ "$VERBOSE" == true ]]; then
                echo "📋 Test errors:"
                tail -10 /tmp/test_output.txt | sed 's/^/   /'
            fi
        fi
    else
        warn_check "tests" "No Jest configuration found in: ${test_configs[*]}"
    fi
}

# Generate report
generate_report() {
    local report_file=""
    
    case $OUTPUT_FORMAT in
        "json")
            report_file="$PROJECT_ROOT/quality-report.json"
            generate_json_report > "$report_file"
            log_info "JSON report generated: $report_file"
            ;;
        "html")
            report_file="$PROJECT_ROOT/quality-report.html"
            generate_html_report > "$report_file"
            log_info "HTML report generated: $report_file"
            ;;
        *)
            generate_console_report
            ;;
    esac
}

# Console report - Fixed for older Bash
generate_console_report() {
    echo
    log_info "📊 Code Quality Report"
    echo "=========================="
    echo
    
    # Summary
    echo "📈 Summary:"
    echo "  Total Checks: $TOTAL_CHECKS"
    echo "  ✅ Passed: $PASSED_CHECKS"
    echo "  ❌ Failed: $FAILED_CHECKS"
    echo "  ⚠️  Warnings: $WARNING_CHECKS"
    echo
    
    # Detailed results
    echo "📋 Detailed Results:"
    local i=0
    for check in "${RESULTS_KEYS[@]}"; do
        local result="${RESULTS_VALUES[$i]}"
        IFS=':' read -r status message <<< "$result"
        case $status in
            "PASS") echo "  ✅ $check: $message" ;;
            "FAIL") echo "  ❌ $check: $message" ;;
            "WARN") echo "  ⚠️  $check: $message" ;;
        esac
        ((i++))
    done
    echo
    
    # Overall status
    if [[ $FAILED_CHECKS -eq 0 ]]; then
        if [[ $WARNING_CHECKS -eq 0 ]]; then
            log_success "🎉 All checks passed!"
        else
            log_warning "✅ All checks passed with warnings"
        fi
    else
        log_error "❌ Some checks failed"
    fi
}

# JSON report - Fixed
generate_json_report() {
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    cat << EOF
{
  "timestamp": "$timestamp",
  "summary": {
    "total": $TOTAL_CHECKS,
    "passed": $PASSED_CHECKS,
    "failed": $FAILED_CHECKS,
    "warnings": $WARNING_CHECKS
  },
  "results": {
EOF
    
    local first=true
    local i=0
    for check in "${RESULTS_KEYS[@]}"; do
        local result="${RESULTS_VALUES[$i]}"
        IFS=':' read -r status message <<< "$result"
        
        if [[ "$first" == true ]]; then
            first=false
        else
            echo ","
        fi
        
        echo -n "    \"$check\": {\"status\": \"$status\", \"message\": \"$message\"}"
        ((i++))
    done
    
    cat << EOF

  }
}
EOF
}

# HTML report
generate_html_report() {
    local timestamp=$(date)
    
    cat << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Code Quality Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .pass { color: green; }
        .fail { color: red; }
        .warn { color: orange; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .check { margin: 10px 0; }
    </style>
</head>
<body>
    <h1>📊 Code Quality Report</h1>
    <p>Generated on: $timestamp</p>
    
    <div class="summary">
        <h2>Summary</h2>
        <p>Total Checks: $TOTAL_CHECKS</p>
        <p class="pass">Passed: $PASSED_CHECKS</p>
        <p class="fail">Failed: $FAILED_CHECKS</p>
        <p class="warn">Warnings: $WARNING_CHECKS</p>
    </div>
    
    <h2>Detailed Results</h2>
EOF
    
    for check in "${!RESULTS[@]}"; do
        IFS=':' read -r status message <<< "${RESULTS[$check]}"
        local class_name=$(echo "$status" | tr '[:upper:]' '[:lower:]')
        echo "    <div class=\"check $class_name\">$check: $message</div>"
    done
    
    echo "</body></html>"
}

# Main function
main() {
    parse_args "$@"
    
    log_step "Starting Code Quality Analysis..."
    
    # Change to project root
    cd "$PROJECT_ROOT" || exit 1
    
    # Load custom configuration if provided
    if [[ -n "$CONFIG_FILE" && -f "$CONFIG_FILE" ]]; then
        log_info "Loading configuration from $CONFIG_FILE"
        # Configuration loading logic here
    fi
    
    # Check dependencies
    if ! check_dependencies; then
        exit 1
    fi
    
    echo
    log_info "🎯 Running Code Quality Checks..."
    echo
    
    # Run all checks
    check_lint
    check_format
    check_types
    check_security
    check_deps
    check_duplicates
    check_tests
    
    # Generate report
    generate_report
    
    # Cleanup temporary files
    rm -f /tmp/eslint_output.txt /tmp/prettier_output.txt /tmp/tsc_output.txt /tmp/audit_output.txt /tmp/test_output.txt
    
    # Exit code logic
    local exit_code=0
    
    if [[ $FAILED_CHECKS -gt 0 ]]; then
        exit_code=1
    elif [[ $WARNING_CHECKS -gt 0 && "$FAIL_ON_WARNINGS" == true ]]; then
        exit_code=1
    fi
    
    exit $exit_code
}

# Run main function
main "$@"