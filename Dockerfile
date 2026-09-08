# builder
FROM node:22-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma prisma/

RUN apt-get update -y && apt-get install -y openssl

RUN npm ci
RUN npm run prisma-gen

COPY . .

RUN npm run build -- --preset node-server

# release
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/.output ./

CMD [ "node", "server/index.mjs" ]
