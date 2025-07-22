#!/bin/bash

Netbox_data="/app/ips.json"
Tmp_File_Output_data="/app/web/json/home.json"
Output_data="/app/web/json/home.json"
date_time=$(date +%Y-%m-%d_%H:%M)

updated_entries=()

while IFS= read -r entry; do
    ip=$(jq -r '.ip' <<< "$entry")
    device=$(jq -r '.device' <<< "$entry")
    description=$(jq -r '.description' <<< "$entry")
    device_description=$(jq -r '.device_description' <<< "$entry")

    [[ -z "$ip" ]] && continue

    if ping -c 1 -W 1 "$ip" > /dev/null 2>&1; then
        status="success"
        echo $date_time" Ping: success: $ip"
    else
        status="failed"
        echo $date_time" Ping: failed: $ip"
    fi

    # Create new object with status
    updated_entry=$(jq -n \
        --arg ip "$ip" \
        --arg device "$device" \
        --arg description "$description" \
        --arg device_description "$device_description" \
        --arg status "$status" \
        '{ip: $ip, device: $device, description: $description, device_description: $device_description, status: $status}')

    # Add to array
    updated_entries+=("$updated_entry")

done < <(jq -c '.[]' "$Netbox_data")

# Output entire array to the temp file as valid JSON
jq -s '.' <<< "${updated_entries[@]}" > "$Tmp_File_Output_data"

mv "$Tmp_File_Output_data" "$Output_data"