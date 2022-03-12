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

ARG TOKEN_SECRET
ENV TOKEN_SECRET=${TOKEN_SECRET}

EXPOSE 3001 3081

CMD ["node", "./dist/main.js"]

# source ./.env.qa
# echo $APP_ENV_WEBSOCKET

#
# docker hub
#
# docker build . -f qa.dockerfile -t cachac/kubelabs_websocket:1.0.3 --build-arg APP_ENV="$APP_ENV_WEBSOCKET"
# docker push cachac/kubelabs_websocket:1.0.3
