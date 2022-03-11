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

EXPOSE 3001 3081

CMD ["node", "./dist/main.js"]

# source ./.env.qa
# echo $APP_ENV_ICECLOUD_PUBSUB

#
# docker hub
#
# docker build . -f qa.dockerfile -t cachac/icecloud_pubsub:latest --build-arg APP_ENV="$APP_ENV_ICECLOUD_PUBSUB"
# docker push cachac/icecloud_pubsub:latest
# server config:
# docker network create --driver bridge --subnet 11.10.0.0/24 iceCloudNetwork
# docker run -dit --network iceCloudNetwork --ip 11.10.0.2 -p 3001:3001 --name icecloud_pubsub cachac/icecloud_pubsub:latest

#
# aws ECR
#
# docker build . -f qa.dockerfile -t 983207445106.dkr.ecr.us-east-1.amazonaws.com/icecloud_pubsub:latest --build-arg APP_ENV="$APP_ENV_ICECLOUD_PUBSUB"
# docker push 983207445106.dkr.ecr.us-east-1.amazonaws.com/icecloud_pubsub:latest
# server config:
# docker network create --driver bridge --subnet 11.10.0.0/24 iceCloudNetwork
# docker run -dit --network iceCloudNetwork --ip 11.10.0.2 -p 3001:3001 -p 3081:3081 --name icecloud_pubsub 983207445106.dkr.ecr.us-east-1.amazonaws.com/icecloud_pubsub:latest

# Access key ID AKIA6J253AJZH4COIPFM
# Secret access key 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
