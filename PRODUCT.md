# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are retail stock investors in Indonesia who research a stock before deciding to buy. Their job: find out who actually owns an emiten — which institutions, funds, or individuals hold meaningful stakes, how much floats freely, and whether ownership is concentrated or dispersed. They browse per-stock ownership detail and, less frequently, look up a specific investor's full portfolio.

## Product Purpose

IDX Stocks Ownership makes the official monthly ownership disclosures of the Indonesia Stock Exchange (BEI/IDX) browsable by the general public. Success is a retail investor being able to answer, in seconds and without a paywall, "who owns this stock and what is really floating." The product exists to publish data that is technically public but practically inaccessible in its official published form.

## Positioning

Raw IDX ownership depth. Unlike consumer tools that summarize or gate ownership data, this product surfaces the complete investor-by-investor holding records straight from official IDX announcements — including small holders, full free float, investor type, local/foreign origin, and month-over-month changes (new entries, gains, losses). No other accessible source presents this depth free of charge.

## Operating Context

- Two primary views, both data-dense and scanable: **Saham** (all emiten, each expandable into a holdings table) and **Investor** (all investors, each expandable into a stock portfolio).
- A monthly **DATA PER** date selector picks the data batch; a stock's holdings table shows per-investor type badge, origin (D = Lokal/domestic, F = Asing/foreign, with domicile for foreign), share count, percentage, and change vs the previous batch (positive/negative deltas and a "Baru"/new marker).
- Filters and sorting: free-text search, sort by ticker / free float / investor count (Saham); sort by name / stock count, filter by origin and investor type (Investor).
- List browsing is a single-column infinite-scroll accordion, deliberately mobile-first; the desktop view is a full-width, horizontally spacious layout.
- Data batches arrive as the official IDX "Pengumuman Bursa — Semua Emiten Saham" release, published monthly at https://www.idx.co.id/id/perusahaan-tercatat/data-kepemilikan-saham and downloaded as an Excel (.xlsx) file, which is parsed into monthly snapshots. Website language is Bahasa Indonesia throughout.

## Capabilities and Constraints

- Stock detail: free float %, count of investors holding >1%, per-investor holdings with type (35+ investor-type classes), origin, foreign domicile, share count, %, and previous-batch change.
- Investor portfolios: every stock held by an investor across a batch, filterable by origin and type.
- Data coverage is bounded by what the official announcements contain; only monthly snapshots exist (no intraday/trading data).
- Share counts are BIGINT and serialized as strings in JSON to avoid precision loss.
- JWT auth is auto-issued for reads (query-param token, 1-day expiry); the CSV upload endpoint is gated separately by a `POST_SECRET` header. Redis-backed cache (5-day TTL) and per-route rate limiting protect the API.
- Undecided: whether additional historical depth, alerting, or comparison views will be built.

## Brand Commitments

- Name **IDX Stocks Ownership** is binding (canonical/OG brand, used at `https://idx-stocks-ownership.vercel.app`).
- Bahasa Indonesia is the committed UI language — all copy, labels, filters, and SEO metadata are Indonesian.
- Official IDX/BEI announcements are the sole data source, published at https://www.idx.co.id/id/perusahaan-tercatat/data-kepemilikan-saham; the `raw-pdf/` folder holds the archived source files. User-facing copy names the source and links to that page, but never states a file format.
- Light-mode-only UI on @nuxt/ui with a neutral, muted, data-dense aesthetic.

## Evidence on Hand

- Source files: `raw-pdf/` — four official "Pengumuman Bursa — Semua Emiten Saham" files (Mar–Jun 2026), archived locally as PDF; the IDX page itself serves the data as Excel (.xlsx).
- Parsing pipeline: `parser/` (Python), with output landing in `server/data` and `server/generated`.
- Production app live at `https://idx-stocks-ownership.vercel.app` with Google site verification (`app/app.vue`).
- No testimonials, case studies, press mentions, or third-party data — future work must not fabricate these.

## Product Principles

- **Depth over decoration.** The raw investor-by-investor record is the product; UI must make large holdings tables scannable, never hide or aggregate away the data.
- **Official data, faithfully presented.** Show exactly what the IDX announcements contain, with change indicators against the previous batch; never invent or truncate holdings.
- **Zero-barrier access.** No signup, no paywall — a retail investor opens the site and answers "who owns this" immediately.
- **Indonesian-first.** All user-facing language is Bahasa Indonesia; domain terminology matches how Indonesian investors speak about the market.
- **Trust through transparency.** Provenance (official announcements, the DATA PER batch) is always visible.

## Accessibility & Inclusion

- Mobile-first responsive design with bottom navigation on phones and top tabs on desktop; input, filter, and sort controls are reachable on small screens.
- No product-specific accessibility standard was confirmed beyond the framework defaults.
