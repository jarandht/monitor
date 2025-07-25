FROM ubuntu:latest

RUN apt update && apt install -y curl jq iputils-ping ca-certificates php php-cli php-curl php-mbstring && update-ca-certificates

COPY fetch_netbox.sh /app/fetch_netbox.sh
COPY ping.sh /app/ping.sh
COPY entrypoint.sh /app/entrypoint.sh
COPY run.sh /app/run.sh
COPY web /app/web

WORKDIR /app
RUN chmod +x *.sh

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["/app/run.sh"]