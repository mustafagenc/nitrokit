#!/bin/bash

MESSAGES_DIR="../messages"
SOURCE_FILE_PATH="${MESSAGES_DIR}/source.json"
REFERENCE_FILE_PATH="${MESSAGES_DIR}/tr.json"

# jq kurulu mu kontrol et
if ! command -v jq &> /dev/null; then
    echo "Hata: jq komutu bulunamadı. Lütfen jq'yu kurun."
    exit 1
fi

# Dosyaların varlığını kontrol et
if [ ! -f "$SOURCE_FILE_PATH" ] || [ ! -f "$REFERENCE_FILE_PATH" ]; then
    echo "Hata: Gerekli dosyalar bulunamadı."
    exit 1
fi

# JSON geçerliliğini kontrol et
if ! jq -e '.' "$SOURCE_FILE_PATH" > /dev/null 2>&1; then
    echo "Hata: $SOURCE_FILE_PATH geçerli bir JSON değil."
    exit 1
fi

if ! jq -e '.' "$REFERENCE_FILE_PATH" > /dev/null 2>&1; then
    echo "Hata: $REFERENCE_FILE_PATH geçerli bir JSON değil."
    exit 1
fi

echo "Bilgi: Yeni anahtarlar tespit ediliyor..."

# source.json'daki tüm yolları ve değerleri al
declare -a NEW_PATHS=()
declare -a NEW_VALUES=()

while IFS='|' read -r path_str value_json; do
    # Bu yol tr.json'da var mı kontrol et
    if ! jq -e --arg path "$path_str" 'getpath($path | split("."))' "$REFERENCE_FILE_PATH" > /dev/null 2>&1; then
        NEW_PATHS+=("$path_str")
        NEW_VALUES+=("$value_json")
    fi
done < <(jq -r 'paths(scalars) as $p | "\($p | join("."))|" + (getpath($p) | tostring)' "$SOURCE_FILE_PATH")

if [ ${#NEW_PATHS[@]} -eq 0 ]; then
    echo "Yeni anahtar bulunamadı."
    exit 0
fi

echo "Bulunan yeni anahtarlar:"
for i in "${!NEW_PATHS[@]}"; do
    echo "  - ${NEW_PATHS[$i]}: ${NEW_VALUES[$i]}"
done

# Tüm dil dosyalarını güncelle
for target_file in "${MESSAGES_DIR}"/*.json; do
    if [ "$(basename "$target_file")" = "source.json" ]; then
        continue
    fi
    
    echo ""
    echo "Güncelleniyor: $target_file"
    
    if ! jq -e '.' "$target_file" > /dev/null 2>&1; then
        echo "  Atlanıyor: Geçersiz JSON"
        continue
    fi
    
    updated=false
    temp_content=$(cat "$target_file")
    
    for i in "${!NEW_PATHS[@]}"; do
        path_str="${NEW_PATHS[$i]}"
        value_str="${NEW_VALUES[$i]}"
        
        # Bu yol hedef dosyada var mı?
        if ! jq -e --arg path "$path_str" 'getpath($path | split("."))' "$target_file" > /dev/null 2>&1; then
            echo "  Ekleniyor: $path_str"
            
            # Yolu ve değeri ekle
            temp_content=$(echo "$temp_content" | jq --arg path "$path_str" --arg val "$value_str" 'setpath($path | split("."); $val)')
            
            if [ $? -eq 0 ]; then
                updated=true
            else
                echo "  Hata: $path_str eklenemedi"
            fi
        fi
    done
    
    if [ "$updated" = true ]; then
        echo "$temp_content" > "$target_file"
        echo "  Başarılı: Dosya güncellendi"
    else
        echo "  Bilgi: Güncelleme gerekmedi"
    fi
done

echo ""
echo "Formatlama çalıştırılıyor..."

if command -v yarn &> /dev/null; then
    if yarn run format:write; then
        echo "Formatlama tamamlandı."
    else
        echo "Uyarı: Formatlama hatası."
    fi
else
    echo "Uyarı: yarn bulunamadı."
fi

echo "İşlem tamamlandı."