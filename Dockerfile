# builder
FROM oven/bun:1.4.3 AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

RUN bun --bun run postinstall
RUN bun --bun run db:gen
RUN bun --bun run build --preset bun

# release
FROM oven/bun:1.4.3-alpine AS release
WORKDIR /app

COPY --from=builder /app/.output ./

CMD ["bun", "server/index.mjs"]
