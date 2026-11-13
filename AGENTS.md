## Rules

- **Commits:** Do NOT add `Co-Authored-By: Claude`, `Co-authored-by: Copilot`, or any co-author attribution in commit messages. Use simple commit prefixes (e.g. `feat: description`, `fix: description`) without adding scope parens like `feat(scope):`.

### Runtime and package manager

- **Bun is required:** AI agents must use Bun as both the JavaScript/TypeScript runtime and package manager for every test, script, build, development server, CLI, and temporary verification tool they execute in this project, including browser automation.
- Use `bun <file>` or `bun -e '<code>'` for scripts, `bun test ./tests` for the test suite, `bun --bun run <script>` for package scripts, and `bunx --bun <command>` for package executables. The `--bun` flag forces Bun even when a CLI has a Node.js shebang.
- Do not execute `node`, `npm`, `npx`, `pnpm`, or `yarn`, including indirectly through a package script or helper. Inspect package scripts before running them. The current `test` and `backfill-investors` scripts invoke Node; use the direct Bun commands below instead.
- Use `bun install`, `bun add`, and `bun remove` to manage dependencies, and maintain `bun.lock`. Do not generate another package manager's lockfile.
- If a tool cannot run under Bun, report the incompatibility instead of falling back to another runtime or package manager.

## Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies |
| `bun --bun run dev` | Start dev server (port 3000) |
| `bun --bun run build` | Production build |
| `bun --bun run generate` | Static site generation |
| `bun --bun run preview` | Preview production build locally |
| `bun --bun run clean` | Clean Nuxt cache |
| `bun test ./tests` | Run the test suite with Bun |
| `bun --bun run db:gen` | Generate Prisma client |
| `bun --bun run db:deploy` | Apply existing database migrations |
| `bun --bun run db:migrate` | Create and apply development migrations |
| `bun scripts/backfill-investors.mjs` | Backfill investor slugs with Bun |
| `bunx --bun nuxt typecheck` | Type-check the project |

## Architecture

**Nuxt 4** (Vue 3 + Nitro) — Indonesian stock ownership data viewer. Displays stock holdings, investor portfolios, and free float data from IDX/BEI.

### Layer structure

```
app/         → Vue frontend (pages, components, Pinia stores, layouts)
server/      → Nitro backend (file-based API routes, services, utils)
shared/      → Types shared between frontend and server
prisma/      → Database schema + migrations
```

### Frontend (`app/`)

- **Pages:** `saham.vue` (stock listing), `investor.vue` (investor listing)
- **Stores (Pinia):** `useDateStore` (date period selector), `useStockStore` (stock data + filters), `useInvestorStore` (investor data + filters)
- **Components:** `SahamAccordion.vue` / `InvestorAccordion.vue` (infinite scroll accordions), `ErrorCard.vue` (error state with retry)
- **Data flow:** Page mount → Pinia store `useFetch`/`$fetch` → API → store reactive refs → components
- **Theme:** `@nuxt/ui` 4 with Tailwind v4, light mode only

### Server API (`server/`)

Nitro file-based routing under `/api/`:

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/token` | No | Issue JWT cookie |
| GET | `/api/info` | Yes | Available date periods |
| GET | `/api/stock` | Yes | All stocks with investors for a date |
| POST | `/api/stock` | Secret header | Upload CSV stock data |
| GET | `/api/stock/hsc` | No | HSC stocks plus the latest `announceAt` |
| POST | `/api/stock/hsc` | Secret header | Bulk upsert HSC concentrations (merge) |
| GET | `/api/stock/list` | No | All ticker-name pairs |
| GET | `/api/stock/:ticker/name` | No | Single stock name |
| GET | `/api/investor` | Yes | Investor portfolios for a date |

- **Auth (reads):** Query-param JWT (`?token=...`). Route middleware checks cookie; if missing, calls `/api/token` to auto-issue a JWT (HS256, 1-day expiry). This token is handed to every visitor, so it gates reads only.
- **Auth (writes):** `POST /api/stock` and `POST /api/stock/hsc` require the `X-Post-Secret` header to match the `POST_SECRET` env var (`require-post-secret.ts`, timing-safe). It does NOT accept the visitor JWT. Unset `POST_SECRET` fails closed with 503.
- **Rate limiting:** Redis-based, 10-60 req/min per route+method in production; every `POST /api/stock*` (CSV upload and HSC) is capped at 5/min.
- **Services:** `stock.service.ts`, `investor.service.ts`, `info.service.ts` — business logic layer between API routes and Prisma.
- **Error pattern:** Services throw HTTP errors via `createError()`; API handlers wrap in try/catch returning `{ message }` or let Nitro handle via `{ statusCode, statusMessage }`.

### Database (PostgreSQL + Prisma 7)

Tables:

- **Info** — monthly data batch metadata. `idxLastUpdated` (string), `month`, `year`. Indexed `(year, month)`.
- **Stock** — company master. `ticker` (PK, CHAR(4)), `name`, `sector`, `hscConcentration` (DECIMAL(5,3), null = not HSC).
- **StockInvestor** — holding records. `ticker` (FK), `investorName`, `investorType`, `localForeign` (D/L/F), `scripless`/`scrip`/`totalHoldingShare` (BIGINT → serialized as string in JSON), `percentage` (DECIMAL(5,2)), `infoId` (FK). Compound index on `(infoId, ticker)`.
- **HscInfo** — single row (`id` = 1, enforced by a CHECK constraint) holding the latest HSC `announceAt` (DATE) and `updatedAt`. `updatedAt` drives the sitemap lastmod of `/`, `/saham`, `/hsc`, and every `/saham/:ticker`.

Prisma client singleton at `server/utils/prisma.ts` using `PrismaPg` adapter. BigInt prototype patched for JSON serialization.

### Types

- `shared/types/index.ts` — `StockDetail` (nested with investors), `InvestorPortfolio` (nested with stocks), `Info`/`InfoResponse`
- `app/types/index.ts` — sort fields, `InvestorOrigin`
- `server/types/index.ts` — raw DB row shapes (`StockHolding`, `HoldingRecord`, `InvestorHolding`), param types, transaction type

### Key patterns

- **Cache:** Redis with 5-day TTL in `server/utils/cache.ts` — `getCache`/`setCache` (check-then-set), `invalidateCache` (single key), `invalidateCacheByPrefix` (all keys under a prefix). Upload clears `infos`, `stock:ticker-names`, and every `landing:` key. Period-scoped `stock:<y-m>` / `investor:<y-m>` entries are left alone; they only expire via TTL.
- **Upload flow:** `X-Post-Secret` check → POST multipart → `parse-stock-upload.ts` → Prisma transaction (create Info + Stock + StockInvestor in chunks of 1000) → invalidate caches. The secret check runs first so an unauthorized request never parses a body or touches Postgres:

```bash
curl -X POST "$SITE/api/stock" \
  -H "X-Post-Secret: $POST_SECRET" \
  -F "file=@data.csv" \
  -F "idxLastUpdated=31 Agt 2026"
```
- **HSC flow:** `X-Post-Secret` check → JSON body → `parse-hsc-payload.ts` (`announceAt` as `YYYY-MM-DD`, `data` as `{ ticker, concentration }[]`, concentration 0–99.999 or `null` to clear) → transaction (reject the whole request with 400 if any ticker is unknown, bulk update only the listed tickers, upsert `HscInfo`) → clear every `stock`, `landing`, `detail`, and `sitemap` cache key:

```bash
curl -X POST "$SITE/api/stock/hsc" \
  -H "X-Post-Secret: $POST_SECRET" \
  -H "content-type: application/json" \
  -d '{"announceAt":"2026-11-13","data":[{"ticker":"OCAP","concentration":99.998}]}'
```
- **Date parsing:** `parseDateTime("31 Agt 2026")` → `{ month, year }` with Indonesian abbreviated month names (Jan, Feb, Mar, Apr, Mei, Jun, Jul, Agt, Sep, Okt, Nov, Des)
- **Token signing/verify:** `sign-token.ts` (HS256, 1d), `verify-token.ts` (JWT from query param)

### Deployment

- Docker multi-stage build with `oven/bun`, frozen `bun.lock` installation, and Nitro's `bun` preset; the server listens on port 3000 by default
- Production host: Vercel (`preset: 'vercel'` when `NODE_ENV=production`)
- Redis via `REDIS_URL` env var for caching and rate limiting
