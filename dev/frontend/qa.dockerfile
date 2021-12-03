# build stage
FROM node:14.11.0-alpine3.12 as base

WORKDIR /app
FROM base as builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run buildqa

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

# docker build . -f qa.dockerfile -t cachac/kube_webapp:latest
# docker push cachac/kube_webapp:latest
