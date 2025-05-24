#!/bin/bash

# Configuration parameters
MESSAGES_DIR="../messages"
SOURCE_FILE_PATH="${MESSAGES_DIR}/source.json"
REFERENCE_FILE_PATH="${MESSAGES_DIR}/tr.json"

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
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --api-key KEY    Gemini API key"
            echo "  --model MODEL    Gemini model name (default: $DEFAULT_GEMINI_MODEL)"
            echo "  --delay SECONDS  Translation delay (default: $DEFAULT_TRANSLATION_DELAY)"
            echo "  -h, --help       Show this help message"
            echo ""
            echo "API key priority order:"
            echo "  1. --api-key parameter"
            echo "  2. GEMINI_API_KEY environment variable"
            echo "  3. .env.local file"
            echo "  4. .env file"
            exit 0
            ;;
        *)
            echo "Unknown parameter: $1"
            echo "For help: $0 --help"
            exit 1
            ;;
    esac
done

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

echo "Info: Detecting new keys..."

# Get all paths and values from source.json
declare -a NEW_PATHS=()
declare -a NEW_VALUES=()

while IFS='|' read -r path_str value_json; do
    # Check if this path exists in tr.json
    if ! jq -e --arg path "$path_str" 'getpath($path | split("."))' "$REFERENCE_FILE_PATH" > /dev/null 2>&1; then
        NEW_PATHS+=("$path_str")
        NEW_VALUES+=("$value_json")
    fi
done < <(jq -r 'paths(scalars) as $p | "\($p | join("."))|" + (getpath($p) | tostring)' "$SOURCE_FILE_PATH")

if [ ${#NEW_PATHS[@]} -eq 0 ]; then
    echo "No new keys found."
    exit 0
fi

echo "Found new keys:"
for i in "${!NEW_PATHS[@]}"; do
    echo "  - ${NEW_PATHS[$i]}: ${NEW_VALUES[$i]}"
done

# Update all language files
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
        
        # Check if this path exists in target file
        if ! jq -e --arg path "$path_str" 'getpath($path | split("."))' "$target_file" > /dev/null 2>&1; then
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
            
            # Add path and value
            temp_content=$(echo "$temp_content" | jq --arg path "$path_str" --arg val "$value_to_use" 'setpath($path | split("."); $val)')
            
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