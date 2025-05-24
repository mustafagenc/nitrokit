#!/bin/bash
# filepath: shell/generate-release-notes.sh

# generate-release-notes.sh - Automatically generate release notes from git history

TAG="$1"
PREV_TAG=""

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Get project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Find previous tag
PREV_TAG=$(git describe --tags --abbrev=0 "$TAG^" 2>/dev/null)

if [[ -z "$PREV_TAG" ]]; then
    PREV_TAG=$(git rev-list --max-parents=0 HEAD)
    COMPARISON_RANGE="$PREV_TAG..$TAG"
    COMPARISON_TEXT="Initial release"
else
    COMPARISON_RANGE="$PREV_TAG..$TAG"
    COMPARISON_TEXT="Changes since $PREV_TAG"
fi

echo "# Release $TAG"
echo ""
echo "## 📋 $COMPARISON_TEXT"
echo ""

# Get release date
RELEASE_DATE=$(git log -1 --format=%ai "$TAG" | cut -d' ' -f1)
echo "**Release Date:** $RELEASE_DATE"
echo ""

# Check if this is a pre-release
if [[ "$TAG" =~ -[a-zA-Z] ]]; then
    echo "🚨 **This is a pre-release version** - Use with caution in production environments."
    echo ""
fi

# Generate commit categorization
FEATURES=$(git log "$COMPARISON_RANGE" --pretty=format:"%s" --grep="feat" --grep="feature" --grep="add" -i)
FIXES=$(git log "$COMPARISON_RANGE" --pretty=format:"%s" --grep="fix" --grep="bug" --grep="hotfix" -i)
IMPROVEMENTS=$(git log "$COMPARISON_RANGE" --pretty=format:"%s" --grep="improve" --grep="enhance" --grep="update" --grep="refactor" -i)
DOCS=$(git log "$COMPARISON_RANGE" --pretty=format:"%s" --grep="doc" --grep="readme" -i)
DEPS=$(git log "$COMPARISON_RANGE" --pretty=format:"%s" --grep="dep" --grep="bump" --grep="upgrade" --grep="yarn" --grep="npm" -i)
TRANSLATIONS=$(git log "$COMPARISON_RANGE" --pretty=format:"%s" --grep="translation" --grep="i18n" --grep="locale" -i)

# Features
if [[ -n "$FEATURES" ]]; then
    echo "## ✨ New Features"
    echo ""
    while IFS= read -r commit; do
        if [[ -n "$commit" ]]; then
            echo "- $commit"
        fi
    done <<< "$FEATURES"
    echo ""
fi

# Bug Fixes
if [[ -n "$FIXES" ]]; then
    echo "## 🐛 Bug Fixes"
    echo ""
    while IFS= read -r commit; do
        if [[ -n "$commit" ]]; then
            echo "- $commit"
        fi
    done <<< "$FIXES"
    echo ""
fi

# Improvements
if [[ -n "$IMPROVEMENTS" ]]; then
    echo "## 🔧 Improvements"
    echo ""
    while IFS= read -r commit; do
        if [[ -n "$commit" ]]; then
            echo "- $commit"
        fi
    done <<< "$IMPROVEMENTS"
    echo ""
fi

# Translation Updates
if [[ -n "$TRANSLATIONS" ]]; then
    echo "## 🌍 Translation Updates"
    echo ""
    while IFS= read -r commit; do
        if [[ -n "$commit" ]]; then
            echo "- $commit"
        fi
    done <<< "$TRANSLATIONS"
    echo ""
fi

# Documentation
if [[ -n "$DOCS" ]]; then
    echo "## 📚 Documentation"
    echo ""
    while IFS= read -r commit; do
        if [[ -n "$commit" ]]; then
            echo "- $commit"
        fi
    done <<< "$DOCS"
    echo ""
fi

# Dependencies
if [[ -n "$DEPS" ]]; then
    echo "## 📦 Dependencies"
    echo ""
    while IFS= read -r commit; do
        if [[ -n "$commit" ]]; then
            echo "- $commit"
        fi
    done <<< "$DEPS"
    echo ""
fi

# Contributors
CONTRIBUTORS=$(git log "$COMPARISON_RANGE" --pretty=format:"%an" | sort | uniq)
if [[ -n "$CONTRIBUTORS" ]]; then
    echo "## 👥 Contributors"
    echo ""
    echo "Thanks to all the contributors who made this release possible:"
    echo ""
    while IFS= read -r contributor; do
        if [[ -n "$contributor" ]]; then
            echo "- @$contributor"
        fi
    done <<< "$CONTRIBUTORS"
    echo ""
fi

# Installation instructions
echo "## 🚀 Installation & Upgrade"
echo ""
echo "### For new projects:"
echo "\`\`\`bash"
echo "git clone https://github.com/mustafagenc/nitrokit.git"
echo "cd nitrokit"
echo "git checkout $TAG"
echo "./shell/dev-setup.sh"
echo "\`\`\`"
echo ""
echo "### For existing projects:"
echo "\`\`\`bash"
echo "git pull origin main"
echo "git checkout $TAG"
echo "./shell/dependency_updater.sh --dry-run  # Preview updates"
echo "./shell/dependency_updater.sh            # Apply updates"
echo "yarn build                               # Test build"
echo "\`\`\`"
echo ""

# Breaking changes warning
BREAKING_CHANGES=$(git log "$COMPARISON_RANGE" --pretty=format:"%s" --grep="BREAKING" --grep="breaking change" -i)
if [[ -n "$BREAKING_CHANGES" ]]; then
    echo "## ⚠️ Breaking Changes"
    echo ""
    echo "🚨 **Important:** This release contains breaking changes. Please review the migration guide before upgrading."
    echo ""
    while IFS= read -r commit; do
        if [[ -n "$commit" ]]; then
            echo "- $commit"
        fi
    done <<< "$BREAKING_CHANGES"
    echo ""
fi

# Security updates
SECURITY_UPDATES=$(git log "$COMPARISON_RANGE" --pretty=format:"%s" --grep="security" --grep="vulnerability" --grep="CVE" -i)
if [[ -n "$SECURITY_UPDATES" ]]; then
    echo "## 🔒 Security Updates"
    echo ""
    echo "🛡️ **Security patches included in this release:**"
    echo ""
    while IFS= read -r commit; do
        if [[ -n "$commit" ]]; then
            echo "- $commit"
        fi
    done <<< "$SECURITY_UPDATES"
    echo ""
fi

# Full changelog
echo "## 📝 Full Changelog"
echo ""
if [[ -n "$PREV_TAG" && "$PREV_TAG" != $(git rev-list --max-parents=0 HEAD) ]]; then
    echo "**Full Changelog**: https://github.com/mustafagenc/nitrokit/compare/$PREV_TAG...$TAG"
else
    echo "**Full Changelog**: https://github.com/mustafagenc/nitrokit/commits/$TAG"
fi
echo ""

# Additional information
echo "---"
echo ""
echo "### 🔗 Useful Links"
echo ""
echo "- 📖 **Documentation**: [README.md](https://github.com/mustafagenc/nitrokit#readme)"
echo "- 🛠️ **Shell Scripts Guide**: [shell/README.md](https://github.com/mustafagenc/nitrokit/blob/main/shell/README.md)"
echo "- 🐛 **Report Issues**: [GitHub Issues](https://github.com/mustafagenc/nitrokit/issues)"
echo "- 💬 **Discussions**: [GitHub Discussions](https://github.com/mustafagenc/nitrokit/discussions)"
echo "- 🌍 **Live Demo**: [nitrokit.vercel.app](https://nitrokit.vercel.app)"
echo ""
echo "### 🆘 Getting Help"
echo ""
echo "If you encounter any issues with this release:"
echo ""
echo "1. Check the [troubleshooting guide](https://github.com/mustafagenc/nitrokit/blob/main/shell/README.md#-troubleshooting-guide)"
echo "2. Search [existing issues](https://github.com/mustafagenc/nitrokit/issues)"
echo "3. Use the automation scripts: \`./shell/dependency_updater.sh --restore BACKUP_ID\`"
echo "4. Create a [new issue](https://github.com/mustafagenc/nitrokit/issues/new) with detailed information"
echo ""
echo "---"
echo ""
echo "**Enjoy building with Nitrokit! 🚀**"