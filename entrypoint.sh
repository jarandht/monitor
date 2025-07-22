#!/bin/bash
set -e

if [ -n "$cert" ]; then
  echo "Installing custom certificate..."
  echo -e "$cert" > /usr/local/share/ca-certificates/cert.crt
  update-ca-certificates
else
  echo "No cert provided, skipping certificate installation."
fi

exec "$@"
