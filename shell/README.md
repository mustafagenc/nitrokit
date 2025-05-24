# Translation Synchronization Script

This script automatically synchronizes new translation keys from `source.json` to all language files and translates them using Google's Gemini API.

## Features

- ✨ Automatic detection of new translation keys
- 🌍 Multi-language support (30+ languages)
- 🤖 AI-powered translation using Gemini API
- 📝 Automatic code formatting with Prettier
- ⚙️ Configurable translation delays and models
- 🔧 Multiple configuration methods

## Prerequisites

- `jq` - JSON processor
- `curl` - HTTP client
- `yarn` - Package manager (for formatting)
- Gemini API key

## Installation

```bash
# Install required dependencies
brew install jq curl  # macOS
# or
apt-get install jq curl  # Ubuntu/Debian

# Make script executable
chmod +x sync_translations_gemini.sh
```

## Configuration Methods

### 1. Environment Variable (Recommended)

```bash
export GEMINI_API_KEY="your-api-key"
./sync_translations_gemini.sh
```

### 2. Command Line Parameters

```bash
./sync_translations_gemini.sh --api-key "your-api-key"
```

### 3. .env File

```bash
echo 'GEMINI_API_KEY=your-api-key' > ../.env
./sync_translations_gemini.sh
```

### 4. .env.local File (Git-ignored)

```bash
echo 'GEMINI_API_KEY=your-api-key' > ../.env.local
./sync_translations_gemini.sh
```

## Usage Examples

### Basic Usage

```bash
# Simple translation with default settings
./sync_translations_gemini.sh --api-key "your-key"
```

### Advanced Usage

```bash
# Custom model and delay
./sync_translations_gemini.sh \
  --api-key "your-key" \
  --model "gemini-1.5-pro" \
  --delay 2

# No translation delay (faster but may hit rate limits)
./sync_translations_gemini.sh \
  --api-key "your-key" \
  --delay 0

# Using different model
./sync_translations_gemini.sh \
  --api-key "your-key" \
  --model "gemini-1.5-flash"
```

### Environment Variables

```bash
# Set multiple configuration options
export GEMINI_API_KEY="your-api-key"
export GEMINI_MODEL="gemini-1.5-pro"
export TRANSLATION_DELAY=2

./sync_translations_gemini.sh
```

### Combination Usage

```bash
# .env.local file for API key, command line for other options
echo 'GEMINI_API_KEY=your-key' > ../.env.local
./sync_translations_gemini.sh --model "gemini-1.5-pro" --delay 1
```

## Available Options

| Option            | Description                | Default            |
| ----------------- | -------------------------- | ------------------ |
| `--api-key KEY`   | Gemini API key             | Required           |
| `--model MODEL`   | Gemini model name          | `gemini-1.5-flash` |
| `--delay SECONDS` | Delay between translations | `1`                |
| `-h, --help`      | Show help message          | -                  |

## Available Models

- `gemini-1.5-flash` (Default - Fast and efficient)
- `gemini-1.5-pro` (More accurate but slower)
- `gemini-pro` (Legacy model)

## Supported Languages

| Code | Language    | Code | Language   | Code | Language   |
| ---- | ----------- | ---- | ---------- | ---- | ---------- |
| `ar` | Arabic      | `de` | German     | `nl` | Dutch      |
| `az` | Azerbaijani | `en` | English    | `no` | Norwegian  |
| `bg` | Bulgarian   | `es` | Spanish    | `pl` | Polish     |
| `bs` | Bosnian     | `et` | Estonian   | `pt` | Portuguese |
| `cs` | Czech       | `fi` | Finnish    | `ro` | Romanian   |
| `da` | Danish      | `fr` | French     | `ru` | Russian    |
| `he` | Hebrew      | `hi` | Hindi      | `sk` | Slovak     |
| `hr` | Croatian    | `hu` | Hungarian  | `sl` | Slovenian  |
| `id` | Indonesian  | `it` | Italian    | `sv` | Swedish    |
| `ja` | Japanese    | `ko` | Korean     | `th` | Thai       |
| `lt` | Lithuanian  | `lv` | Latvian    | `tr` | Turkish    |
| `ms` | Malay       | `uk` | Ukrainian  | `ur` | Urdu       |
| `uz` | Uzbek       | `vi` | Vietnamese | `zh` | Chinese    |

## Configuration Priority

The script follows this priority order for configuration:

1. **Command line parameters** (highest priority)
2. **Environment variables**
3. **`.env.local` file**
4. **`.env` file** (lowest priority)

## File Structure

```
project/
├── messages/
│   ├── source.json      # Source file with new keys
│   ├── tr.json         # Reference file (Turkish)
│   ├── en.json         # English translations
│   ├── es.json         # Spanish translations
│   └── ...             # Other language files
└── shell/
    └── sync_translations_gemini.sh
```

## Error Handling

The script handles various error conditions:

- Missing dependencies (`jq`, `curl`)
- Invalid JSON files
- API rate limits and errors
- Network connectivity issues
- Missing or invalid API keys

## Security Notes

⚠️ **Important Security Practices:**

```bash
# Add to .gitignore to avoid committing API keys
echo ".env.local" >> .gitignore
echo ".env" >> .gitignore

# Use .env.local for sensitive data
echo 'GEMINI_API_KEY=your-secret-key' > .env.local
```

## Troubleshooting

### Common Issues

1. **Rate Limits**: Increase `--delay` parameter
2. **API Quota Exceeded**: Check your Google Cloud billing
3. **Formatting Errors**: Ensure `yarn` is installed and working
4. **Missing Translations**: Check if language is supported

### Debug Mode

```bash
# Run with verbose output
set -x
./sync_translations_gemini.sh --api-key "your-key"
set +x
```

## Example Output

```
Info: Gemini API key found, translation enabled.
Info: Using model: gemini-1.5-flash
Info: Translation delay: 1 seconds
Info: Detecting new keys...
Found new keys:
  - privacy.terms: Terms of Service
  - footer.poweredBy: Powered by <link>Team</link>.

Updating: ../messages/es.json
  Target language: Spanish
  Adding: privacy.terms
    Translating...
    Translation: Términos de Servicio
    Waiting 1 seconds...
  Success: File updated
  Formatting...
    ✓ Formatted

Process completed.
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/mustafagenc/nitrokit/blob/main/LICENSE) file for details.
