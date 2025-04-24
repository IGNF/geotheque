FROM node:18-alpine AS build

WORKDIR /app
COPY . .

RUN rm -rf node_modules
RUN npm install
RUN npm run build

FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80
