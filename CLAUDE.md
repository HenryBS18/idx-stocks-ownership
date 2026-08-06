# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- **Commits:** Do NOT add `Co-Authored-By: Claude` or any co-author attribution in commit messages.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run generate` | Static site generation |
| `npm run preview` | Preview production build locally |
| `npm run clean` | Clean Nuxt cache |
| `npm run prisma-gen` | Generate Prisma client |
| `npx nuxt typecheck` | Type-check the project |

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
| POST | `/api/stock` | Yes | Upload JSON stock data |
| POST | `/api/stock/csv` | Yes | Upload CSV stock data |
| GET | `/api/stock/list` | No | All ticker-name pairs |
| GET | `/api/stock/:ticker/name` | No | Single stock name |
| GET | `/api/investor` | Yes | Investor portfolios for a date |

- **Auth:** Query-param JWT (`?token=...`). Route middleware checks cookie; if missing, calls `/api/token` to auto-issue a JWT (HS256, 1-day expiry).
- **Rate limiting:** Redis-based, 10-60 req/min per route in production.
- **Services:** `stock.service.ts`, `investor.service.ts`, `info.service.ts` — business logic layer between API routes and Prisma.
- **Error pattern:** Services throw HTTP errors via `createError()`; API handlers wrap in try/catch returning `{ message }` or let Nitro handle via `{ statusCode, statusMessage }`.

### Database (PostgreSQL + Prisma 7)

Three tables:

- **Info** — monthly data batch metadata. `idxLastUpdated` (string), `month`, `year`. Indexed `(year, month)`.
- **Stock** — company master. `ticker` (PK, CHAR(4)), `name`.
- **StockInvestor** — holding records. `ticker` (FK), `investorName`, `investorType`, `localForeign` (D/L/F), `scripless`/`scrip`/`totalHoldingShare` (BIGINT → serialized as string in JSON), `percentage` (DECIMAL(5,2)), `infoId` (FK). Compound index on `(infoId, ticker)`.

Prisma client singleton at `server/utils/prisma.ts` using `PrismaPg` adapter. BigInt prototype patched for JSON serialization.

### Types

- `shared/types/index.ts` — `StockDetail` (nested with investors), `InvestorPortfolio` (nested with stocks), `Info`/`InfoResponse`
- `app/types/index.ts` — sort fields, `InvestorOrigin`
- `server/types/index.ts` — raw DB row shapes (`StockHolding`, `HoldingRecord`, `InvestorHolding`), param types, transaction type

### Key patterns

- **Cache:** Redis with 5-day TTL in `server/utils/cache.ts`. Invalidated on upload. Uses `getSetCache` (check-then-set).
- **Upload flow:** POST multipart → `parse-stock-upload.ts` → Prisma transaction (create Info + Stock + StockInvestor in chunks of 1000) → invalidate caches
- **Date parsing:** `parseDateTime("12 Jan 2025")` → `{ month, year }` with English abbreviated month names
- **Token signing/verify:** `sign-token.ts` (HS256, 1d), `verify-token.ts` (JWT from query param)

### Deployment

- Docker multi-stage build with `oven/npm`, exposes port 3000
- Production host: Vercel (`preset: 'vercel'` when `NODE_ENV=production`)
- Redis via `REDIS_URL` env var for caching and rate limiting
