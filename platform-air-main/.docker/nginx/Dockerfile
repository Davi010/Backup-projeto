FROM nginx:alpine

RUN apk update && apk add bash netcat-openbsd

RUN rm /etc/nginx/conf.d/default.conf
COPY ./.docker/nginx/nginx.conf /etc/nginx/conf.d
COPY ./.docker/nginx/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80 5173

ENTRYPOINT ["/entrypoint.sh"]