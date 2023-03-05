FROM alpine:3.17.2

RUN apk add --update --no-cache bash github-cli

ENTRYPOINT ["./entrypoint.sh"]
