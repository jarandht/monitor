netbox_api_token="${netbox_api_token}"
netbox_url="${netbox_url}"

curl -s -H "Authorization: Token ${netbox_api_token}" "${netbox_url}/api/ipam/ip-addresses/?limit=0" | jq -s '
  [ .[].results[]
    | select(.custom_fields.Ping == true)
    | {
        ip: (.address | split("/")[0]),
        device: (
          if .assigned_object.device != null then
            .assigned_object.device.name
          elif .assigned_object.virtual_machine != null then
            .assigned_object.virtual_machine.name
          else
            ""
          end
        ),
        device_description: (
          if .assigned_object.device != null then
            .assigned_object.device.description
          elif .assigned_object.virtual_machine != null then
            .assigned_object.virtual_machine.description
          else
            ""
          end
        ),
        description: .description
      }
  ]
' > /app/ips.json