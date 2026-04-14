FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.d/99-env-config.sh

COPY --from=build /app/dist /usr/share/nginx/html
COPY public/env-config.template.js /usr/share/nginx/html/env-config.template.js

RUN chmod +x /docker-entrypoint.d/99-env-config.sh

EXPOSE 80
