#!/bin/bash

# labels.sh - GitHub label management script with auto-installation

# Help function
show_help() {
    cat << EOF
🏷️  GitHub Label Management Script for Nitrokit

USAGE:
    ./labels.sh [OPTIONS]

DESCRIPTION:
    Automatically manages GitHub repository labels with emojis and proper categorization.
    The script can install GitHub CLI, authenticate users, and create/update labels.

OPTIONS:
    -h, --help          Show this help message and exit
    --skip-auth         Skip GitHub authentication check
    --skip-install      Skip GitHub CLI installation check
    --dry-run           Show what would be done without making changes
    --list-only         Only list current labels, don't make changes
    --delete-all        Delete all existing labels before creating new ones
    --update-only       Only update existing labels, don't create new ones

FEATURES:
    ✅ Auto-installation of GitHub CLI
    ✅ Cross-platform support (macOS, Linux, Windows)
    ✅ GitHub authentication handling
    ✅ Updates existing labels with emojis
    ✅ Creates Nitrokit-specific labels
    ✅ Organized label categories

LABEL CATEGORIES:
    🐛 Bug tracking        - bug, invalid
    ✨ Enhancements       - enhancement, feature
    🔴 Priorities         - critical, high, medium, low
    🔄 Status             - in progress, needs review, blocked
    🎯 Components         - ui/ux, translation, gemini-api
    🌱 Difficulty         - easy, medium, hard
    🔒 Security           - security related issues
    ⚡ Performance        - optimization issues
    ♿ Accessibility      - accessibility improvements

EXAMPLES:
    ./labels.sh                    # Run with all checks and updates
    ./labels.sh --help             # Show this help
    ./labels.sh --dry-run          # Preview changes without applying
    ./labels.sh --list-only        # Just show current labels
    ./labels.sh --skip-auth        # Skip authentication check
    ./labels.sh --update-only      # Only update existing labels

REQUIREMENTS:
    - Bash shell
    - Internet connection
    - GitHub repository access
    - GitHub CLI (auto-installed if missing)

AUTHENTICATION:
    The script will prompt for GitHub authentication if needed.
    You can also authenticate manually: gh auth login

TROUBLESHOOTING:
    - Permission denied: chmod +x labels.sh
    - Authentication failed: gh auth login
    - Labels already exist: Use --update-only flag
    - Network issues: Check internet connection

MORE INFO:
    GitHub: https://github.com/mustafagenc/nitrokit
    Issues: https://github.com/mustafagenc/nitrokit/issues

EOF
}

# Parse command line arguments
SKIP_AUTH=false
SKIP_INSTALL=false
DRY_RUN=false
LIST_ONLY=false
DELETE_ALL=false
UPDATE_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --skip-auth)
            SKIP_AUTH=true
            shift
            ;;
        --skip-install)
            SKIP_INSTALL=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --list-only)
            LIST_ONLY=true
            shift
            ;;
        --delete-all)
            DELETE_ALL=true
            shift
            ;;
        --update-only)
            UPDATE_ONLY=true
            shift
            ;;
        *)
            echo "❌ Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo "🏷️  Managing GitHub labels for Nitrokit..."

# Show configuration
if [[ "$DRY_RUN" == true ]]; then
    echo "🔍 DRY RUN MODE - No changes will be made"
fi

if [[ "$LIST_ONLY" == true ]]; then
    echo "📋 LIST ONLY MODE - Just showing current labels"
fi

# Function to detect operating system
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get &> /dev/null; then
            echo "ubuntu"
        elif command -v yum &> /dev/null; then
            echo "centos"
        elif command -v dnf &> /dev/null; then
            echo "fedora"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

# Function to install GitHub CLI
install_gh_cli() {
    local os=$(detect_os)
    echo "🔧 Installing GitHub CLI for $os..."
    
    if [[ "$DRY_RUN" == true ]]; then
        echo "🔍 DRY RUN: Would install GitHub CLI for $os"
        return 0
    fi
    
    case $os in
        "macos")
            if command -v brew &> /dev/null; then
                echo "Installing via Homebrew..."
                brew install gh
            elif command -v port &> /dev/null; then
                echo "Installing via MacPorts..."
                sudo port install gh
            else
                echo "❌ Neither Homebrew nor MacPorts found."
                echo "Please install Homebrew first: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                echo "Then run: brew install gh"
                exit 1
            fi
            ;;
        "ubuntu")
            echo "Installing via apt-get..."
            curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
            sudo apt update
            sudo apt install gh -y
            ;;
        "centos")
            echo "Installing via yum..."
            sudo yum install -y dnf-plugins-core
            sudo yum config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
            sudo yum install gh -y
            ;;
        "fedora")
            echo "Installing via dnf..."
            sudo dnf install gh -y
            ;;
        "windows")
            echo "❌ Windows detected. Please install GitHub CLI manually:"
            echo "1. Download from: https://github.com/cli/cli/releases"
            echo "2. Or use Chocolatey: choco install gh"
            echo "3. Or use Scoop: scoop install gh"
            echo "4. Or use Winget: winget install --id GitHub.cli"
            exit 1
            ;;
        "linux")
            echo "❌ Unsupported Linux distribution."
            echo "Please install GitHub CLI manually from: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
            exit 1
            ;;
        *)
            echo "❌ Unsupported operating system: $OSTYPE"
            echo "Please install GitHub CLI manually from: https://cli.github.com/"
            exit 1
            ;;
    esac
}

# Check if GitHub CLI is installed
if [[ "$SKIP_INSTALL" == false ]] && ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    read -p "🤔 Would you like to install it automatically? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_gh_cli
        
        # Verify installation
        if command -v gh &> /dev/null; then
            echo "✅ GitHub CLI installed successfully!"
            echo "📋 Version: $(gh --version | head -n 1)"
        else
            echo "❌ Installation failed. Please install manually."
            exit 1
        fi
    else
        echo "❌ GitHub CLI is required. Please install it manually:"
        echo ""
        echo "🍎 macOS: brew install gh"
        echo "🐧 Ubuntu/Debian: apt install gh"
        echo "🟦 Windows: choco install gh"
        echo "📦 Or download from: https://cli.github.com/"
        exit 1
    fi
elif command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found: $(gh --version | head -n 1)"
fi

# Check if user is authenticated
if [[ "$SKIP_AUTH" == false ]]; then
    echo ""
    echo "🔐 Checking GitHub authentication..."
    if ! gh auth status &> /dev/null; then
        echo "❌ Not authenticated with GitHub."
        echo ""
        read -p "🔑 Would you like to authenticate now? (y/N): " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if [[ "$DRY_RUN" == true ]]; then
                echo "🔍 DRY RUN: Would authenticate with GitHub"
            else
                echo "🌐 Opening browser for authentication..."
                gh auth login --web
                
                # Verify authentication
                if gh auth status &> /dev/null; then
                    echo "✅ Authentication successful!"
                else
                    echo "❌ Authentication failed."
                    exit 1
                fi
            fi
        else
            echo "❌ GitHub authentication is required."
            echo "Run: gh auth login"
            exit 1
        fi
    else
        echo "✅ Already authenticated with GitHub"
        gh auth status
    fi
fi

# List only mode
if [[ "$LIST_ONLY" == true ]]; then
    echo ""
    echo "📋 Current labels:"
    gh label list --limit 50
    exit 0
fi

echo ""
echo "🏷️  Starting label management..."

# Delete all labels if requested
if [[ "$DELETE_ALL" == true ]]; then
    echo "🗑️  Deleting all existing labels..."
    if [[ "$DRY_RUN" == true ]]; then
        echo "🔍 DRY RUN: Would delete all existing labels"
        gh label list --limit 100 | while IFS= read -r line; do
            label_name=$(echo "$line" | awk '{print $1}')
            echo "🔍 Would delete: $label_name"
        done
    else
        gh label list --limit 100 | while IFS= read -r line; do
            label_name=$(echo "$line" | awk '{print $1}')
            echo "Deleting: $label_name"
            gh label delete "$label_name" --yes 2>/dev/null || echo "  ⚠️  Could not delete $label_name"
        done
    fi
fi

# Rest of your existing script continues here...
# (All the existing label creation/update logic with DRY_RUN checks)

existing_labels_to_update=(
  "bug|🐛 bug|Software bugs and defects|D73A49"
  "dependencies|📦 dependencies|Dependency updates and package management|0366D6"
  "documentation|📚 documentation|Documentation improvements and updates|0075CA"
  "duplicate|🔄 duplicate|Duplicate issues already reported|CFD3D7"
  "enhancement|✨ enhancement|New features and improvements|A2EEEF"
  "github_actions|⚙️ github_actions|CI/CD and GitHub Actions workflow|000000"
  "good first issue|🌟 good first issue|Beginner-friendly issues for new contributors|7057FF"
  "help wanted|🙏 help wanted|Issues where community help is needed|008672"
  "invalid|❌ invalid|Invalid or incorrectly reported issues|E4E669"
  "question|❓ question|Questions about usage or implementation|CC317C"
  "wontfix|🚫 wontfix|Issues that won't be addressed|FFFFFF"
)

if [[ "$UPDATE_ONLY" != true ]]; then
    echo "🔄 Updating existing labels with emojis..."
    
    # Update existing labels
    for label in "${existing_labels_to_update[@]}"; do
      IFS='|' read -r old_name new_name description color <<< "$label"
      echo "Updating: $old_name → $new_name"
      
      if [[ "$DRY_RUN" == true ]]; then
        echo "🔍 DRY RUN: Would update $old_name to $new_name"
      else
        if gh label edit "$old_name" --name "$new_name" --description "$description" --color "$color" 2>/dev/null; then
          echo "  ✅ Updated successfully"
        else
          echo "  ⚠️  Error updating or label not found"
        fi
      fi
    done
fi

# New labels creation logic continues...
# (Rest of your existing script with DRY_RUN checks added to all gh commands)

echo ""
echo "🎉 Label management completed!"
echo ""
echo "📋 Current labels:"
gh label list --limit 50
echo ""
echo "🔧 Useful commands:"
echo "📋 To view all labels: gh label list"
echo "🗑️  To delete a label: gh label delete 'label-name' --yes"
echo "✏️  To edit a label: gh label edit 'label-name' --description 'new desc' --color 'FFFFFF'"
echo "❓ For help: ./labels.sh --help"