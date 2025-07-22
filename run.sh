#!/bin/bash

netbox_api_fetch_interval="${netbox_api_fetch_interval:-2400}"
ping_interval="${ping_interval:-60}"
date_time=$(date "+[%a %b %d %H:%M:%S %Y]")

echo "Startup initialized"

(
  while true; do
    echo $date_time" Fetching netbox IPs" 
    /app//fetch_netbox.sh
    sleep "$netbox_api_fetch_interval"
  done
) &

(
  while true; do
    /app//ping.sh
    sleep "$ping_interval"
  done
) &

set -e

php -S 0.0.0.0:8080 -t /app/web

wait