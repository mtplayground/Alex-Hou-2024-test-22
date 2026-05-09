FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_DEFAULT_CITY=San Francisco
ARG VITE_REFRESH_INTERVAL_MS=60000

ENV VITE_DEFAULT_CITY=$VITE_DEFAULT_CITY
ENV VITE_REFRESH_INTERVAL_MS=$VITE_REFRESH_INTERVAL_MS

RUN npm run build

FROM nginx:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
