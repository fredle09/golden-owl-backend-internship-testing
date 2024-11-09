# Use a multi-stage build to reduce the image size
# Stage 1: Build the application
FROM node:latest AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Setup the production environment
FROM node:alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Add a .env file to your Dockerfile during the build process
COPY .env /usr/src/app/.env

EXPOSE 3001

CMD [ "node", "dist/main"]