#!/bin/bash

# Default configuration
DEFAULT_MESSAGES_DIR="../messages"
DEFAULT_SOURCE_FILE="source.json"
DEFAULT_REFERENCE_FILE="tr.json"

# Initialize with defaults
MESSAGES_DIR="${MESSAGES_DIR:-$DEFAULT_MESSAGES_DIR}"
SOURCE_FILE="${SOURCE_FILE:-$DEFAULT_SOURCE_FILE}"
REFERENCE_FILE="${REFERENCE_FILE:-$DEFAULT_REFERENCE_FILE}"

# Help function
show_help() {
    cat << EOF
🔄 Nitrokit Basic Translation Synchronization

USAGE:
    ./sync_translations.sh [OPTIONS]

DESCRIPTION:
    Synchronizes translation keys across language files without AI dependencies.
    Detects new keys in source file and adds them to all target language files
    with the source language values as placeholders for manual translation.

OPTIONS:
    --messages-dir DIR      Messages directory path (default: $DEFAULT_MESSAGES_DIR)
    --source-file FILE      Source file name (default: $DEFAULT_SOURCE_FILE)
    --reference-file FILE   Reference file name (default: $DEFAULT_REFERENCE_FILE)
    --no-format            Skip Prettier formatting
    --dry-run              Show what would be done without making changes
    -h, --help             Show this help message and exit

FEATURES:
    ✅ No external API dependencies
    ✅ Automatic key synchronization
    ✅ JSON validation and error handling
    ✅ Preserves existing translations
    ✅ Optional Prettier formatting
    ✅ Cross-platform compatibility

WORKFLOW:
    1. 🔍 Scans source file for all translation keys
    2. 📋 Compares with reference file to find new keys
    3. 📝 Adds new keys to all language files
    4. ✨ Formats files with Prettier (optional)
    5. ✅ Reports statistics and completion

USE CASES:
    - 🧪 Development environments without API access
    - 👥 Manual translation workflows
    - 🚀 Quick key synchronization
    - 💻 Offline translation management
    - 🔄 Fallback when AI service unavailable

EXAMPLES:
    # Basic usage with default paths
    ./sync_translations.sh

    # Custom messages directory
    ./sync_translations.sh --messages-dir "locales"

    # Custom source and reference files
    ./sync_translations.sh --source-file "en.json" --reference-file "base.json"

    # Dry run to preview changes
    ./sync_translations.sh --dry-run

    # Skip formatting
    ./sync_translations.sh --no-format

REQUIREMENTS:
    - jq (JSON processor) - brew install jq / apt install jq
    - yarn (optional, for formatting)

TROUBLESHOOTING:
    - Missing jq: Install with package manager
    - Invalid JSON: Check file syntax with jq
    - Permission errors: Check file/directory permissions
    - Formatting issues: Ensure yarn is installed

MORE INFO:
    GitHub: https://github.com/mustafagenc/nitrokit
    Issues: https://github.com/mustafagenc/nitrokit/issues

EOF
}

# Parse command line arguments
NO_FORMAT=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --messages-dir)
            MESSAGES_DIR="$2"
            shift 2
            ;;
        --source-file)
            SOURCE_FILE="$2"
            shift 2
            ;;
        --reference-file)
            REFERENCE_FILE="$2"
            shift 2
            ;;
        --no-format)
            NO_FORMAT=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "❌ Unknown parameter: $1"
            echo "💡 For help: $0 --help"
            exit 1
            ;;
    esac
done

# Build full paths
SOURCE_FILE_PATH="${MESSAGES_DIR}/${SOURCE_FILE}"
REFERENCE_FILE_PATH="${MESSAGES_DIR}/${REFERENCE_FILE}"

echo "🔄 Starting translation synchronization..."
echo "📁 Messages directory: $MESSAGES_DIR"
echo "📄 Source file: $SOURCE_FILE"
echo "📄 Reference file: $REFERENCE_FILE"

if [[ "$DRY_RUN" == true ]]; then
    echo "🔍 DRY RUN MODE - No changes will be made"
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "❌ Error: jq command not found."
    echo "📦 Install with: brew install jq (macOS) or apt install jq (Ubuntu)"
    exit 1
fi

# Check if files exist
if [ ! -f "$SOURCE_FILE_PATH" ]; then
    echo "❌ Error: Source file not found: $SOURCE_FILE_PATH"
    exit 1
fi

if [ ! -f "$REFERENCE_FILE_PATH" ]; then
    echo "❌ Error: Reference file not found: $REFERENCE_FILE_PATH"
    exit 1
fi

# Check JSON validity
if ! jq -e '.' "$SOURCE_FILE_PATH" > /dev/null 2>&1; then
    echo "❌ Error: $SOURCE_FILE_PATH is not valid JSON."
    exit 1
fi

if ! jq -e '.' "$REFERENCE_FILE_PATH" > /dev/null 2>&1; then
    echo "❌ Error: $REFERENCE_FILE_PATH is not valid JSON."
    exit 1
fi

echo "🔍 Detecting new translation keys..."

# Get all paths and values from source.json
declare -a NEW_PATHS=()
declare -a NEW_VALUES=()

while IFS='|' read -r path_str value_json; do
    # Check if this path exists in reference file
    if ! jq -e --arg path "$path_str" 'getpath($path | split("."))' "$REFERENCE_FILE_PATH" > /dev/null 2>&1; then
        NEW_PATHS+=("$path_str")
        NEW_VALUES+=("$value_json")
    fi
done < <(jq -r 'paths(scalars) as $p | "\($p | join("."))|" + (getpath($p) | tostring)' "$SOURCE_FILE_PATH")

if [ ${#NEW_PATHS[@]} -eq 0 ]; then
    echo "✅ No new keys found. All files are up to date."
    exit 0
fi

echo "📋 Found ${#NEW_PATHS[@]} new keys:"
for i in "${!NEW_PATHS[@]}"; do
    echo "  • ${NEW_PATHS[$i]}: ${NEW_VALUES[$i]}"
done

if [[ "$DRY_RUN" == true ]]; then
    echo ""
    echo "🔍 DRY RUN: Would update the following files:"
    for target_file in "${MESSAGES_DIR}"/*.json; do
        if [ "$(basename "$target_file")" = "$SOURCE_FILE" ]; then
            continue
        fi
        echo "  • $(basename "$target_file")"
    done
    echo ""
    echo "🔍 DRY RUN: No actual changes made."
    exit 0
fi

# Update all language files
echo ""
echo "📝 Updating language files..."

total_files=0
updated_files=0

for target_file in "${MESSAGES_DIR}"/*.json; do
    if [ "$(basename "$target_file")" = "$SOURCE_FILE" ]; then
        continue
    fi
    
    total_files=$((total_files + 1))
    echo ""
    echo "Processing: $(basename "$target_file")"
    
    if ! jq -e '.' "$target_file" > /dev/null 2>&1; then
        echo "  ⚠️  Skipped: Invalid JSON format"
        continue
    fi
    
    updated=false
    temp_content=$(cat "$target_file")
    
    for i in "${!NEW_PATHS[@]}"; do
        path_str="${NEW_PATHS[$i]}"
        value_str="${NEW_VALUES[$i]}"
        
        # Check if this path exists in target file
        if ! jq -e --arg path "$path_str" 'getpath($path | split("."))' "$target_file" > /dev/null 2>&1; then
            echo "  ➕ Adding: $path_str"
            
            # Add path and value
            temp_content=$(echo "$temp_content" | jq --arg path "$path_str" --arg val "$value_str" 'setpath($path | split("."); $val)')
            
            if [ $? -eq 0 ]; then
                updated=true
            else
                echo "  ❌ Error: Could not add $path_str"
            fi
        fi
    done
    
    if [ "$updated" = true ]; then
        echo "$temp_content" > "$target_file"
        echo "  ✅ Success: File updated"
        updated_files=$((updated_files + 1))
    else
        echo "  ℹ️  Info: No updates needed"
    fi
done

echo ""
echo "📊 Summary:"
echo "  • Files processed: $total_files"
echo "  • Files updated: $updated_files"
echo "  • New keys added: ${#NEW_PATHS[@]}"

# Formatting
if [[ "$NO_FORMAT" == false ]]; then
    echo ""
    echo "✨ Running Prettier formatting..."
    
    if command -v yarn &> /dev/null; then
        if yarn run format:write > /dev/null 2>&1; then
            echo "✅ Formatting completed successfully."
        else
            echo "⚠️  Warning: Formatting failed."
        fi
    else
        echo "⚠️  Warning: yarn not found, skipping formatting."
        echo "💡 Install yarn or use --no-format flag."
    fi
else
    echo "⏭️  Skipping formatting (--no-format specified)."
fi

echo ""
echo "🎉 Translation synchronization completed!"
echo ""
echo "📝 Next steps:"
echo "  1. Review the added keys in language files"
echo "  2. Replace placeholder values with proper translations"
echo "  3. Use sync_translations_gemini.sh for automatic AI translations"
echo ""
echo "💡 For help: $0 --help"