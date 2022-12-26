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

ARG PRIVATE_API
ENV PRIVATE_API=${PRIVATE_API}

EXPOSE 3000

CMD ["node", "./dist/main.js"]


# source .env.qa
# echo $APP_ENV_KUBE_API

#
# docker hub
#

# docker build . -t cachac/kubelabs_publicapi:2.0.0 --build-arg APP_ENV="$APP_ENV_KUBE_API"
# docker run --rm --name api -p 3000:3000 -p 3080:3080 cachac/kubelabs_publicapi:2.0.0
# docker push cachac/kubelabs_publicapi:2.0.0
