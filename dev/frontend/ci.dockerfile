# build stage
FROM node:14.11.0-alpine3.12 as base

WORKDIR /app
FROM base as builder
COPY ./dev/frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY ./dev/frontend/ .
RUN npm run buildqa

# qa stage
FROM nginx:stable-alpine AS qa-stage
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./dev/frontend/nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

# docker build . -f qa.dockerfile -t cachac/kube_webapp:latest
# docker push cachac/kube_webapp:latest
