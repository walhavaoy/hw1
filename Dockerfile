ARG BASE_IMAGE=nginx:alpine
FROM ${BASE_IMAGE}
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
