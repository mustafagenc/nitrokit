#!/bin/bash

# --- Yapılandırma ---
MESSAGES_DIR="messages"                                # Çeviri dosyalarının bulunduğu dizin
BASE_LANG="en"                                         # Temel dil kodu (örn: en)
GEMINI_MODEL="gemini-1.5-flash-latest"                 # Kullanılacak Gemini modeli
API_REQUEST_DELAY=1                                    # API çağrıları arası saniye cinsinden gecikme (kota aşımını önlemek için)

# Gemini API Anahtarını ortam değişkeninden al
GEMINI_API_KEY="${GEMINI_API_KEY}"

# --- Kontroller ---
if [ -z "$GEMINI_API_KEY" ]; then
  echo "Hata: GEMINI_API_KEY ortam değişkeni ayarlanmamış."
  echo "Lütfen API anahtarınızı ayarlayın: export GEMINI_API_KEY=\"YOUR_API_KEY\""
  exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "Hata: 'jq' komutu bulunamadı. Lütfen jq'yu kurun."
    exit 1
fi

BASE_FILE="${MESSAGES_DIR}/${BASE_LANG}.json"
if [ ! -f "$BASE_FILE" ]; then
  echo "Hata: Temel dil dosyası (${BASE_FILE}) bulunamadı."
  exit 1
fi

echo "Temel dil dosyası kullanılıyor: ${BASE_FILE}"
echo "Hedef çeviriler için Gemini Modeli: ${GEMINI_MODEL}"
echo "API çağrıları arası gecikme: ${API_REQUEST_DELAY} saniye"
echo "---"

# --- Yardımcı Fonksiyonlar ---

# Dil kodunu tam dil adına çevirir (Gemini'ye daha iyi bir prompt için)
get_language_name() {
  local lang_code="$1"
  case "$lang_code" in
    "es") echo "Spanish" ;;
    "fr") echo "French" ;;
    "de") echo "German" ;;
    "it") echo "Italian" ;;
    "ja") echo "Japanese" ;;
    "ko") echo "Korean" ;;
    "pt") echo "Portuguese" ;;
    "ru") echo "Russian" ;;
    "zh") echo "Chinese" ;;
    "tr") echo "Turkish" ;;
    "ar") echo "Arabic" ;;
    "nl") echo "Dutch" ;;
    *) echo "$lang_code" ;; # Bilinmeyen kodlar için kodu olduğu gibi döndür
  esac
}

# JSON içindeki metinleri özyinelemeli olarak çevirir
translate_json_object() {
  local current_json_str="$1"
  local current_path_prefix="$2"
  local target_lang_code="$3"
  local base_lang_file_content="$4" # Bu parametre şu an kullanılmıyor ama gelecekte gerekebilir
  local api_key="$5"

  local translated_obj="{}"

  # JSON'daki tüm anahtarları al
  for key in $(echo "$current_json_str" | jq -r 'keys_unsorted[]'); do
    local value_type=$(echo "$current_json_str" | jq -r --arg k "$key" '.[$k] | type')
    local current_full_key="${current_path_prefix}${key}"

    if [ "$value_type" == "string" ]; then
      local text_to_translate=$(echo "$current_json_str" | jq -r --arg k "$key" '.[$k]')
      local target_lang_name=$(get_language_name "$target_lang_code")

      echo "Çevriliyor [${target_lang_code}] Anahtar: '${current_full_key}': \"${text_to_translate}\""

      local prompt="Translate the following English text to ${target_lang_name}. Provide only the translated text, without any additional explanations or quotation marks around the translation itself: \"${text_to_translate}\""

      local api_url="https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${api_key}"
      local payload
      payload=$(jq -n --arg prompt_text "$prompt" \
        '{contents: [{parts: [{text: $prompt_text}]}]}')

      # API Çağrısı
      local http_response
      http_response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" \
        -d "$payload" \
        "$api_url")

      local http_code="${http_response##*$'\n'}"
      local api_response_body="${http_response%$'\n'*}"
      local translated_text="$text_to_translate" # Başarısız olursa orijinal metne geri dön

      if [ "$http_code" -eq 200 ]; then
        if echo "$api_response_body" | jq -e '.error' > /dev/null; then
          local error_message=$(echo "$api_response_body" | jq -r '.error.message')
          echo "  Uyarı: Gemini API hatası (${current_full_key}). HTTP: $http_code. Hata: $error_message. Orijinal: '${text_to_translate}'"
        else
          local extracted_translation
          extracted_translation=$(echo "$api_response_body" | jq -r '.candidates[0].content.parts[0].text // empty')
          if [ -z "$extracted_translation" ]; then
            echo "  Uyarı: Çeviri boş döndü (${current_full_key}). Orijinal: '${text_to_translate}'. Yanıt: $api_response_body"
          else
            # Gemini bazen çeviriyi tırnak içine alabilir, bunları temizle
            translated_text=$(echo "$extracted_translation" | sed -e 's/^"//' -e 's/"$//' | sed -e "s/^'//" -e "s/'$//")
            echo "  Çevrildi: \"$translated_text\""
          fi
        fi
      else
        echo "  Uyarı: API çağrısı başarısız (${current_full_key}). HTTP: $http_code. Orijinal: '${text_to_translate}'. Yanıt: $api_response_body"
      fi

      translated_obj=$(echo "$translated_obj" | jq --arg k "$key" --arg v "$translated_text" '. + {($k): $v}')
      sleep "$API_REQUEST_DELAY" # API kotasını aşmamak için bekle

    elif [ "$value_type" == "object" ]; then
      local nested_json_value=$(echo "$current_json_str" | jq --arg k "$key" '.[$k]')
      echo "İç içe obje işleniyor: '${current_full_key}'..."
      local nested_translated_obj
      nested_translated_obj=$(translate_json_object "$nested_json_value" "${current_full_key}." "$target_lang_code" "$base_lang_file_content" "$api_key")

      # Check if the returned nested object is valid JSON
      if ! echo "$nested_translated_obj" | jq -e . > /dev/null 2>&1; then
        echo "  Uyarı: İç içe obje '${current_full_key}' için çeviri sonucu geçerli bir JSON değil. Alınan: '$nested_translated_obj'. Bu anahtar için varsayılan olarak boş obje '{}' kullanılacak." >&2
        nested_translated_obj="{}" # Default to an empty JSON object if translation failed or returned invalid JSON
      fi

      translated_obj=$(echo "$translated_obj" | jq --arg k "$key" --argjson v "$nested_translated_obj" '. + {($k): $v}')
    else
      # String veya obje olmayan değerleri (sayı, boolean, array vb.) olduğu gibi kopyala
      # Not: Diziler içindeki string'leri çevirmek için ek mantık gerekebilir.
      local other_value=$(echo "$current_json_str" | jq --arg k "$key" '.[$k]')
      echo "Kopyalanıyor (string/obje değil) Anahtar: '${current_full_key}', Değer: $other_value"
      translated_obj=$(echo "$translated_obj" | jq --arg k "$key" --argjson v "$other_value" '. + {($k): $v}')
    fi
  done
  echo "$translated_obj"
}

# --- Ana Betik Mantığı ---

# Temel dil dosyasının içeriğini oku
BASE_JSON_CONTENT=$(cat "$BASE_FILE")

# Mesajlar dizinindeki tüm JSON dosyalarını işle
for target_file_path in "${MESSAGES_DIR}"/*.json; do
  target_filename=$(basename "$target_file_path")
  target_lang_code="${target_filename%.json}" # 'es.json' dosyasından 'es' dil kodunu çıkarır

  # Temel dil dosyasını atla
  if [ "$target_lang_code" == "$BASE_LANG" ]; then
    echo "Temel dil dosyası atlanıyor: ${target_filename}"
    continue
  fi

  echo "Hedef dil dosyası işleniyor: ${target_filename} (Dil: ${target_lang_code})"

  # Temel JSON içeriğini kullanarak çeviriyi başlat
  translated_json_content=$(translate_json_object "$BASE_JSON_CONTENT" "" "$target_lang_code" "$BASE_JSON_CONTENT" "$GEMINI_API_KEY")

  # Çevrilen içeriğin geçerli JSON olup olmadığını kontrol et
  if ! echo "$translated_json_content" | jq -e . > /dev/null 2>&1; then
      echo "Hata: ${target_filename} için geçerli JSON oluşturulamadı."
      echo "Sorunlu içerik: $translated_json_content"
      echo "---"
      continue
  fi

  # Çevrilen JSON'u hedef dosyaya yaz (güzel formatla)
  echo "$translated_json_content" | jq '.' > "$target_file_path"
  echo "${target_file_path} başarıyla çevrildi ve güncellendi."
  echo "---"
done

echo "Tüm çeviri işlemleri tamamlandı."