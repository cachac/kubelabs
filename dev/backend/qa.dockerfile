FROM node:14.11.0-alpine3.12 as base

WORKDIR /app

#builder stage
FROM base as builder
COPY package*.json ./

RUN npm ci
#--only=production
COPY ./src ./src

RUN npm run build
RUN npm prune --production

#----------------release-----------------
FROM base AS release
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

#USER nodedoc

ARG APP_ENV
ENV APP_ENV=${APP_ENV}

EXPOSE 3000 3080

CMD ["node", "./dist/main.js"]


# source ./.env.qa
# echo $APP_ENV_KUBE_API

#
# docker hub
#
# docker build . -f qa.dockerfile -t cachac/kube_api:latest --build-arg APP_ENV="$APP_ENV_KUBE_API"
# docker push cachac/kube_api:latest

