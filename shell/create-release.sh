#!/bin/bash
# filepath: shell/create-release.sh

# create-release.sh - Create and publish a new release

VERSION="$1"
MESSAGE="$2"

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Help function
show_help() {
    cat << EOF
🎯 Create Release - Create and publish a new release with automated notes

USAGE:
    ./create-release.sh VERSION [MESSAGE]

DESCRIPTION:
    Creates a new git tag and pushes it to trigger the GitHub Actions release workflow.
    Automatically generates release notes from git history.

ARGUMENTS:
    VERSION     Release version (e.g., v1.0.0, v2.1.0-beta.1)
    MESSAGE     Optional release message (default: "Release VERSION")

EXAMPLES:
    ./create-release.sh v1.0.0                    # Create stable release
    ./create-release.sh v1.1.0-beta.1             # Create pre-release
    ./create-release.sh v2.0.0 "Major update"     # With custom message

VERSION FORMATS:
    v1.0.0        - Stable release
    v1.0.0-rc.1   - Release candidate
    v1.0.0-beta.1 - Beta release
    v1.0.0-alpha.1 - Alpha release

EOF
}

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

# Validate version format
validate_version() {
    local version="$1"
    if [[ ! "$version" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?$ ]]; then
        log_error "Invalid version format: $version"
        log_info "Expected format: v1.0.0 or v1.0.0-beta.1"
        return 1
    fi
}

# Check if tag already exists
check_existing_tag() {
    local version="$1"
    if git tag -l | grep -q "^$version$"; then
        log_error "Tag $version already exists"
        return 1
    fi
}

# Validate input
if [[ -z "$VERSION" ]]; then
    log_error "Version is required"
    show_help
    exit 1
fi

if [[ "$VERSION" == "--help" || "$VERSION" == "-h" ]]; then
    show_help
    exit 0
fi

# Validate version format
if ! validate_version "$VERSION"; then
    exit 1
fi

# Check if tag exists
if ! check_existing_tag "$VERSION"; then
    exit 1
fi

# Set default message
if [[ -z "$MESSAGE" ]]; then
    MESSAGE="Release $VERSION"
fi

# Get project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

log_step "Creating release $VERSION..."

# Check if working directory is clean
if [[ -n $(git status --porcelain) ]]; then
    log_warning "Working directory has uncommitted changes"
    log_info "Commit or stash changes before creating a release"
    exit 1
fi

# Ensure we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    log_warning "Not on main branch (currently on: $CURRENT_BRANCH)"
    log_info "Switch to main branch before creating a release"
    exit 1
fi

# Pull latest changes
log_step "Pulling latest changes..."
git pull origin main

# Run tests
log_step "Running tests..."
if ! yarn test; then
    log_error "Tests failed. Fix tests before creating release."
    exit 1
fi

# Run build
log_step "Testing build..."
if ! yarn build; then
    log_error "Build failed. Fix build errors before creating release."
    exit 1
fi

# Update dependencies if needed
log_step "Checking for dependency updates..."
./dependency_updater.sh --dry-run

# Update translations
log_step "Updating translations..."
./sync_translations.sh

# Generate release notes preview
log_step "Generating release notes preview..."
./generate-release-notes.sh "$VERSION" > "/tmp/release-notes-$VERSION.md"

echo ""
log_info "Release notes preview:"
echo "----------------------------------------"
head -20 "/tmp/release-notes-$VERSION.md"
echo "..."
echo "----------------------------------------"
echo ""

# Confirm release creation
read -p "Create and publish release $VERSION? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Release creation cancelled"
    exit 0
fi

# Create annotated tag
log_step "Creating git tag..."
git tag -a "$VERSION" -m "$MESSAGE"

# Push tag to trigger GitHub Actions
log_step "Pushing tag to GitHub..."
git push origin "$VERSION"

log_success "Release $VERSION created successfully!"
log_info "GitHub Actions will automatically:"
log_info "  ✅ Build the project"
log_info "  ✅ Run tests"
log_info "  ✅ Generate release notes"
log_info "  ✅ Create GitHub release"
log_info "  ✅ Upload artifacts"

echo ""
log_info "🔗 Monitor the release process:"
log_info "  https://github.com/mustafagenc/nitrokit/actions"
echo ""
log_info "🎉 Release will be available at:"
log_info "  https://github.com/mustafagenc/nitrokit/releases/tag/$VERSION"

# Cleanup
rm -f "/tmp/release-notes-$VERSION.md"