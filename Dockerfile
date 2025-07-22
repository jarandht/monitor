FROM alpine:3.18

RUN apk update && apk add --no-cache \
    curl \
    jq \
    iputils \
    ca-certificates

# Enable community repo by adding it to /etc/apk/repositories explicitly
RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.18/community" >> /etc/apk/repositories \
    && apk update \
    && apk add --no-cache \
        php81 \
        php81-cli \
        php81-curl \
        php81-mbstring \
        php81-phar \
        php81-json \
        php81-openssl

RUN update-ca-certificates

COPY fetch_netbox.sh /app/fetch_netbox.sh
COPY ping.sh /app/ping.sh
COPY entrypoint.sh /app/entrypoint.sh
COPY run.sh /app/run.sh
COPY web /app/web
RUN ls -l /app


RUN chmod +x /app/*.sh

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["/app/run.sh"]