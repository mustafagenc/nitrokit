#!/bin/bash

# Configuration parameters 
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MESSAGES_DIR="${PROJECT_ROOT}/messages"
SOURCE_FILE_PATH="${MESSAGES_DIR}/source.json"
REFERENCE_FILE_PATH="${MESSAGES_DIR}/tr.json"

# ... rest of the script remains the same

# Check if files exist
echo "Debug: Script directory: $SCRIPT_DIR"
echo "Debug: Project root: $PROJECT_ROOT"
echo "Debug: Messages directory: $MESSAGES_DIR"
echo "Debug: Source file: $SOURCE_FILE_PATH"
echo "Debug: Reference file: $REFERENCE_FILE_PATH"

if [ ! -f "$SOURCE_FILE_PATH" ]; then
    echo "Error: Source file not found: $SOURCE_FILE_PATH"
    echo "Please create messages/source.json with your source translations"
    exit 1
fi

if [ ! -f "$REFERENCE_FILE_PATH" ]; then
    echo "Error: Reference file not found: $REFERENCE_FILE_PATH"
    echo "Please create messages/tr.json with your Turkish translations"
    exit 1
fi

# Default values
DEFAULT_GEMINI_MODEL="gemini-1.5-flash"
DEFAULT_TRANSLATION_DELAY=1

# Load .env files
if [ -f "$(dirname "$0")/../.env" ]; then
    source "$(dirname "$0")/../.env"
fi

if [ -f "$(dirname "$0")/../.env.local" ]; then
    source "$(dirname "$0")/../.env.local"
fi

# Initial values
GEMINI_API_KEY="${GEMINI_API_KEY:-}"
GEMINI_MODEL="${GEMINI_MODEL:-$DEFAULT_GEMINI_MODEL}"
TRANSLATION_DELAY="${TRANSLATION_DELAY:-$DEFAULT_TRANSLATION_DELAY}"

# Enhanced help function
show_help() {
    cat << EOF
🌍 Nitrokit Translation Synchronization with Gemini AI

USAGE:
    ./sync_translations_gemini.sh [OPTIONS]

DESCRIPTION:
    Automatically detects new translation keys in source.json and translates them
    to 30+ languages using Google Gemini AI. Includes automatic formatting and
    error handling for production-ready internationalization workflow.

OPTIONS:
    --api-key KEY       Gemini API key (overrides environment variables)
    --model MODEL       Gemini model name (default: $DEFAULT_GEMINI_MODEL)
    --delay SECONDS     Delay between API calls (default: $DEFAULT_TRANSLATION_DELAY)
    -h, --help          Show this help message and exit

CONFIGURATION PRIORITY:
    1. Command line parameters (highest priority)
    2. GEMINI_API_KEY environment variable
    3. .env.local file
    4. .env file (lowest priority)

FEATURES:
    ✅ Auto-detects new translation keys
    ✅ AI-powered translations via Gemini API
    ✅ Supports 30+ languages automatically
    ✅ Rate limiting with configurable delays
    ✅ Automatic Prettier formatting
    ✅ JSON validation and error handling
    ✅ Preserves existing translations

SUPPORTED LANGUAGES:
    🇹🇷 Turkish    🇺🇸 English     🇪🇸 Spanish      🇫🇷 French
    🇩🇪 German     🇮🇹 Italian     🇵🇹 Portuguese   🇷🇺 Russian
    🇯🇵 Japanese   🇰🇷 Korean      🇨🇳 Chinese      🇸🇦 Arabic
    🇮🇳 Hindi      🇳🇱 Dutch       🇸🇪 Swedish      🇳🇴 Norwegian
    🇩🇰 Danish     🇫🇮 Finnish     🇵🇱 Polish       🇨🇿 Czech
    🇭🇺 Hungarian  🇷🇴 Romanian    🇧🇬 Bulgarian    🇭🇷 Croatian
    🇸🇰 Slovak     🇸🇮 Slovenian   🇪🇪 Estonian     🇱🇻 Latvian
    🇱🇹 Lithuanian 🇺🇦 Ukrainian   🇮🇱 Hebrew       🇹🇭 Thai
    🇻🇳 Vietnamese 🇮🇩 Indonesian  🇲🇾 Malay        🇦🇿 Azerbaijani
    🇧🇦 Bosnian    🇵🇰 Urdu        🇺🇿 Uzbek

EXAMPLES:
    # Basic usage with environment variable
    export GEMINI_API_KEY="your-api-key"
    ./sync_translations_gemini.sh

    # With custom API key and model
    ./sync_translations_gemini.sh --api-key "your-key" --model "gemini-1.5-pro"

    # With custom delay for rate limiting
    ./sync_translations_gemini.sh --delay 3

    # Using .env file
    echo "GEMINI_API_KEY=your-api-key" > ../.env.local
    ./sync_translations_gemini.sh

REQUIREMENTS:
    - jq (JSON processor)
    - curl (HTTP client)
    - yarn (for Prettier formatting)
    - Gemini API key from Google AI Studio

SETUP INSTRUCTIONS:
    1. Get API key from: https://makersuite.google.com/app/apikey
    2. Set environment variable: export GEMINI_API_KEY="your-key"
    3. Or create .env.local file with: GEMINI_API_KEY=your-key
    4. Run script: ./sync_translations_gemini.sh

FILE STRUCTURE:
    messages/
    ├── source.json      # Source translations (English)
    ├── tr.json         # Reference file (Turkish)
    ├── es.json         # Spanish translations
    ├── fr.json         # French translations
    └── ...             # Other language files

WORKFLOW:
    1. 🔍 Scans source.json for new translation keys
    2. 🌍 Translates new keys to all supported languages
    3. 📝 Updates language files with new translations
    4. ✨ Formats files with Prettier
    5. ✅ Reports success and statistics

ERROR HANDLING:
    - Invalid JSON files are skipped with warnings
    - API errors fallback to original English text
    - Network issues are handled gracefully
    - Missing dependencies are reported clearly

TROUBLESHOOTING:
    - Missing jq: brew install jq (macOS) or apt install jq (Ubuntu)
    - Missing curl: Usually pre-installed on most systems
    - API key issues: Check key validity at Google AI Studio
    - Rate limiting: Increase --delay parameter
    - Formatting issues: Check yarn installation

MORE INFO:
    GitHub: https://github.com/mustafagenc/nitrokit
    Documentation: https://github.com/mustafagenc/nitrokit/tree/main/shell
    Issues: https://github.com/mustafagenc/nitrokit/issues

EOF
}

# Process command line parameters (highest priority)
while [[ $# -gt 0 ]]; do
    case $1 in
        --api-key)
            GEMINI_API_KEY="$2"
            shift 2
            ;;
        --model)
            GEMINI_MODEL="$2"
            shift 2
            ;;
        --delay)
            TRANSLATION_DELAY="$2"
            shift 2
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

# Rest of your existing script continues here...

# Check if jq and curl are installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq command not found. Please install jq."
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo "Error: curl command not found. Please install curl."
    exit 1
fi

# Check API key
if [ "$GEMINI_API_KEY" = "YOUR_GEMINI_API_KEY_HERE" ] || [ -z "$GEMINI_API_KEY" ]; then
    echo "Warning: Gemini API key not set. Translation will be skipped."
    USE_TRANSLATION=false
else
    USE_TRANSLATION=true
    echo "Info: Gemini API key found, translation enabled."
    echo "Info: Using model: $GEMINI_MODEL"
    echo "Info: Translation delay: ${TRANSLATION_DELAY} seconds"
fi

# Check if files exist
if [ ! -f "$SOURCE_FILE_PATH" ] || [ ! -f "$REFERENCE_FILE_PATH" ]; then
    echo "Error: Required files not found."
    exit 1
fi

# Check JSON validity
if ! jq -e '.' "$SOURCE_FILE_PATH" > /dev/null 2>&1; then
    echo "Error: $SOURCE_FILE_PATH is not valid JSON."
    exit 1
fi

if ! jq -e '.' "$REFERENCE_FILE_PATH" > /dev/null 2>&1; then
    echo "Error: $REFERENCE_FILE_PATH is not valid JSON."
    exit 1
fi

# Function to convert language codes from filename to language name
get_language_name() {
    local filename="$1"
    case "$filename" in
        "tr.json") echo "Turkish" ;;
        "en.json") echo "English" ;;
        "es.json") echo "Spanish" ;;
        "fr.json") echo "French" ;;
        "de.json") echo "German" ;;
        "it.json") echo "Italian" ;;
        "pt.json") echo "Portuguese" ;;
        "ru.json") echo "Russian" ;;
        "ja.json") echo "Japanese" ;;
        "ko.json") echo "Korean" ;;
        "zh.json") echo "Chinese" ;;
        "ar.json") echo "Arabic" ;;
        "hi.json") echo "Hindi" ;;
        "nl.json") echo "Dutch" ;;
        "sv.json") echo "Swedish" ;;
        "no.json") echo "Norwegian" ;;
        "da.json") echo "Danish" ;;
        "fi.json") echo "Finnish" ;;
        "pl.json") echo "Polish" ;;
        "cs.json") echo "Czech" ;;
        "hu.json") echo "Hungarian" ;;
        "ro.json") echo "Romanian" ;;
        "bg.json") echo "Bulgarian" ;;
        "hr.json") echo "Croatian" ;;
        "sk.json") echo "Slovak" ;;
        "sl.json") echo "Slovenian" ;;
        "et.json") echo "Estonian" ;;
        "lv.json") echo "Latvian" ;;
        "lt.json") echo "Lithuanian" ;;
        "uk.json") echo "Ukrainian" ;;
        "he.json") echo "Hebrew" ;;
        "th.json") echo "Thai" ;;
        "vi.json") echo "Vietnamese" ;;
        "id.json") echo "Indonesian" ;;
        "ms.json") echo "Malay" ;;
        "az.json") echo "Azerbaijani" ;;
        "bs.json") echo "Bosnian" ;;
        "ur.json") echo "Urdu" ;;
        "uz.json") echo "Uzbek" ;;
        *) echo "" ;;
    esac
}

# Function to translate text using Gemini
translate_text() {
    local text="$1"
    local target_language="$2"
    
    if [ "$USE_TRANSLATION" = false ]; then
        echo "$text"
        return
    fi
    
    if [ -z "$text" ] || [ -z "$target_language" ]; then
        echo "$text"
        return
    fi
    
    # Create JSON payload safely
    local json_payload=$(jq -n \
        --arg prompt "Translate the following text to $target_language. Return only the translated text, no explanations: $text" \
        '{
            "contents": [{
                "parts": [{
                    "text": $prompt
                }]
            }]
        }')
    
    # Gemini API endpoint (using parameterized model)
    local response=$(curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$json_payload" 2>&1)
    
    local curl_exit_code=$?
    
    if [ $curl_exit_code -ne 0 ]; then
        echo "$text"
        return
    fi
    
    # Check for API errors
    local error_message=$(echo "$response" | jq -r '.error.message // empty' 2>/dev/null)
    if [ -n "$error_message" ]; then
        echo "$text"
        return
    fi
    
    local translated=$(echo "$response" | jq -r '.candidates[0].content.parts[0].text // empty' 2>/dev/null)
    
    if [ -n "$translated" ] && [ "$translated" != "null" ] && [ "$translated" != "empty" ]; then
        # Clean quotes from translation
        translated=$(echo "$translated" | sed 's/^["'\'']*//; s/["'\'']*$//')
        echo "$translated"
    else
        echo "$text"
    fi
}

# Function to format file with prettier
format_file() {
    local file_path="$1"
    
    # Go to main project directory (exit shell/ directory)
    cd "$(dirname "$0")/.." || return
    
    if command -v yarn &> /dev/null; then
        # Adjust file path relative to main directory
        local relative_path=$(echo "$file_path" | sed 's|^\.\./||')
        
        if yarn prettier --write "$relative_path" > /dev/null 2>&1; then
            echo "    ✓ Formatted"
        else
            echo "    ⚠ Formatting error"
        fi
    else
        echo "    ⚠ yarn not found, formatting skipped"
    fi
    
    # Return to original directory
    cd - > /dev/null || return
}

# Line 335 civarında mevcut kod yerine:
echo "Info: Detecting new keys..."

# Get all paths and values from source.json
declare -a NEW_PATHS=()
declare -a NEW_VALUES=()

# Improved key detection - checks both missing paths and missing values
while IFS='|' read -r path_str value_json; do
    # Skip empty paths
    if [ -z "$path_str" ] || [ "$value_json" = "null" ]; then
        continue
    fi
    
    # Check if this path exists in tr.json (REFERENCE FILE)
    local exists_in_reference=$(jq -e --arg path "$path_str" 'getpath($path | split(".")) != null' "$REFERENCE_FILE_PATH" 2>/dev/null)
    
    if [ "$exists_in_reference" != "true" ]; then
        NEW_PATHS+=("$path_str")
        NEW_VALUES+=("$value_json")
    fi
done < <(jq -r 'paths(scalars) as $p | "\($p | join("."))|" + (getpath($p) | tostring)' "$SOURCE_FILE_PATH")

# Also check for completely missing parent objects
while IFS= read -r parent_path; do
    if [ -n "$parent_path" ]; then
        local parent_exists=$(jq -e --arg path "$parent_path" 'getpath($path | split(".")) != null' "$REFERENCE_FILE_PATH" 2>/dev/null)
        if [ "$parent_exists" != "true" ]; then
            # This parent path is missing, we need to ensure all its children are added
            echo "  Debug: Missing parent path detected: $parent_path"
        fi
    fi
done < <(jq -r 'paths(objects) as $p | $p | join(".")' "$SOURCE_FILE_PATH")

if [ ${#NEW_PATHS[@]} -eq 0 ]; then
    echo "No new keys found."
    exit 0
fi

# ... existing code until line ~370 ...

echo "Found new keys:"
for i in "${!NEW_PATHS[@]}"; do
    echo "  - ${NEW_PATHS[$i]}: ${NEW_VALUES[$i]}"
done

# Function to safely set nested path in JSON
set_nested_path() {
    local json_content="$1"
    local path_str="$2"
    local value="$3"
    
    # Use Python if available (most reliable)
    if command -v python3 &> /dev/null; then
        python3 -c "
import json
import sys

try:
    data = json.loads('''$json_content''')
    path_parts = '$path_str'.split('.')
    
    # Navigate to the correct nested position
    current = data
    for part in path_parts[:-1]:
        # Only create if it doesn't exist or is not a dict
        if part not in current:
            current[part] = {}
        elif not isinstance(current[part], dict):
            current[part] = {}
        current = current[part]
    
    # Set the final value at the EXACT path
    final_key = path_parts[-1]
    current[final_key] = '''$value'''
    
    print(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    
except Exception as e:
    print('''$json_content''', file=sys.stderr)
    sys.exit(1)
"
    else
        # JQ fallback with exact path handling
        echo "$json_content" | jq --arg path "$path_str" --arg val "$value" '
            ($path | split(".")) as $p |
            setpath($p; $val)
        '
    fi
}

# Update all language files (SADECE BİR KERE!)
for target_file in "${MESSAGES_DIR}"/*.json; do
    if [ "$(basename "$target_file")" = "source.json" ]; then
        continue
    fi
    
    filename=$(basename "$target_file")
    target_language=$(get_language_name "$filename")
    
    echo ""
    echo "Updating: $target_file"
    
    if [ -n "$target_language" ] && [ "$USE_TRANSLATION" = true ]; then
        echo "  Target language: $target_language"
    else
        echo "  Translation will be skipped (language not recognized or translation disabled)"
    fi
    
    if ! jq -e '.' "$target_file" > /dev/null 2>&1; then
        echo "  Skipping: Invalid JSON"
        continue
    fi
    
    updated=false
    temp_content=$(cat "$target_file")
    
    for i in "${!NEW_PATHS[@]}"; do
        path_str="${NEW_PATHS[$i]}"
        original_value="${NEW_VALUES[$i]}"
        
        # Check if this EXACT path exists in target file
        if ! echo "$temp_content" | jq -e --arg path "$path_str" 'getpath($path | split("."))' > /dev/null 2>&1; then
            echo "  Adding: $path_str"
            
            # Translate if language is known and API key is available
            if [ -n "$target_language" ] && [ "$USE_TRANSLATION" = true ]; then
                echo "    Translating..."
                translated_value=$(translate_text "$original_value" "$target_language")
                echo "    Translation: $translated_value"
                value_to_use="$translated_value"
                
                # Wait for specified duration after each translation
                echo "    Waiting ${TRANSLATION_DELAY} seconds..."
                sleep "$TRANSLATION_DELAY"
            else
                echo "    Translation not performed, using original value"
                value_to_use="$original_value"
            fi
            
            # Use the set_nested_path function
            temp_content=$(set_nested_path "$temp_content" "$path_str" "$value_to_use")
            
            if [ $? -eq 0 ]; then
                updated=true
            else
                echo "  Error: Failed to add $path_str"
            fi
        fi
    done
    
    if [ "$updated" = true ]; then
        echo "$temp_content" > "$target_file"
        echo "  Success: File updated"
        
        # Format with prettier after file update
        echo "  Formatting..."
        format_file "$target_file"
    else
        echo "  Info: No update needed"
    fi
done

echo ""
echo "Process completed."