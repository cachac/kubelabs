# qa stage
FROM nginx:stable-alpine AS qa-stage

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
