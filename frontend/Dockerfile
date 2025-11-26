# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install && npm run build

# ---- Serve Stage ----
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]