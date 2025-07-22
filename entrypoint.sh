#!/bin/bash
set -e

if [ -n "$cert" ]; then
  echo "Installing custom certificate..."
  echo -e "$cert" > /usr/local/share/ca-certificates/cert.crt
  update-ca-certificates
else
  echo "No cert provided, skipping certificate installation."
fi


# Vars
OUTPUT_FILE="/app/web/json/config/site_config.json"

VARS=("header_title" "header_img" "title" "img" "web_refresh")

echo "[" > "$OUTPUT_FILE"
echo " {" >> "$OUTPUT_FILE"

for var in "${VARS[@]}"; do
  val="${!var}"
  esc_val=$(printf '%s' "$val" | sed 's/"/\\"/g')
  echo "  \"${var}\": \"${esc_val}\"," >> "$OUTPUT_FILE"
done

sed -i '$ s/,$//' "$OUTPUT_FILE"
echo "  }" >> "$OUTPUT_FILE"
echo "]" >> "$OUTPUT_FILE"
echo "Wrote config.json with selected environment variables."


exec "$@"