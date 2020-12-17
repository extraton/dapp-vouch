FROM nginx:stable

COPY ./dist /usr/share/nginx/html
COPY ./deploy/default.nginx.conf /etc/nginx/conf.d
COPY ./deploy/nginx.mime.types /etc/nginx/mime.types
