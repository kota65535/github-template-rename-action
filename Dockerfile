FROM alpine:3.17.2

RUN apk add --update --no-cache bash github-cli

ADD *.sh /bin/
RUN chmod +x /bin/entrypoint.sh /bin/rename.sh


ENTRYPOINT ["/bin/entrypoint.sh"]
