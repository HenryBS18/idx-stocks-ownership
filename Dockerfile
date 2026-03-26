# builder
FROM oven/bun:1.2.20-slim AS builder
WORKDIR /app

COPY package.json bun.lock ./
COPY prisma prisma/

RUN apt-get update -y && apt-get install -y openssl

RUN bun install --frozen-lockfile
RUN bun prisma-gen

COPY . .

RUN bun run build --preset bun

# release
FROM oven/bun:1.2.20-alpine
WORKDIR /app

COPY --from=builder /app/.output ./

CMD [ "bun", "server/index.mjs" ]