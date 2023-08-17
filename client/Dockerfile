# FROM node:alpine AS builder

# WORKDIR /react-app

# COPY package.json .
# COPY package-lock.json .

# RUN npm install

# COPY . .

# RUN npm run build

# FROM node:alpine

# WORKDIR /app

# COPY --from=builder /react-app/build ./build

# EXPOSE 8000

# CMD ["npx", "serve", "-s", "build"]

FROM node:alpine as build
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]