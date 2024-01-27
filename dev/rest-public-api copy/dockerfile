FROM node:20-alpine3.18 as base

WORKDIR /app

RUN apk add curl bash --no-cache
RUN curl -sf https://gobinaries.com/tj/node-prune | sh


#----------------BUILD-----------------
FROM base as builder
COPY ./src ./src
COPY package*.json ./

RUN npm install

# RUN npm run build
RUN npm prune --production && node-prune

#----------------RELEASE-----------------
FROM node:20-alpine3.18 as release
RUN apk add dumb-init

USER node

COPY --chown=node:node --from=builder /app/ ./

ARG APP_ENV
ENV APP_ENV=${APP_ENV}

ARG PRIVATE_API
ENV PRIVATE_API=${PRIVATE_API}



EXPOSE 3000

CMD ["dumb-init", "node", "src/main.js"]

# source .env.qa
# echo $APP_ENV_KUBE_API

#
# docker hub
#

# docker build . -t cachac/kubelabs_public_api:rest1.0 --build-arg APP_ENV="$APP_ENV_KUBE_API"
# docker run --rm --name api -p 3000:3000 -p 3080:3080 cachac/kubelabs_public_api:rest1.0
# docker push cachac/kubelabs_public_api:rest1.0
