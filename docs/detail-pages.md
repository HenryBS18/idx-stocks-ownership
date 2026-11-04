# Stock and investor detail pages

Detail pages use the shared date selector. A new browser visit opens the latest reporting period; navigation within the app keeps the selected date. URLs do not encode that date. Unknown entities return 404, while known entities without records for a period show an empty state.

## Shareholder ordering

The stock listing, stock detail, and landing APIs order shareholders as Pengendali, Afiliasi, then investors without either classification. Each group uses descending ownership percentage, with investor name A–Z to break ties. Stock details sort after aggregation; landing previews sort before the 25-row limit. Tables render the API order directly. Investor portfolios retain ticker ordering.

The stock-detail chart independently selects the five largest holders by percentage. The largest-shareholder summary finds the maximum percentage, regardless of relationship classification. Both use investor name A–Z to break ties without changing table rows.

Cache keys remain unversioned: `stock:<year>-<month>`, `detail:<kind>:<identifier>:<year>-<month>`, and `landing:<year>-<month>`. When deploying this ordering change, manually clear the stock-period, stock-detail, and landing entries. Until cleared or expired, existing entries can still return the previous order. Cache TTLs and upload invalidation behavior are unchanged.

## Database rollout

Before deploying this version, apply the additive migration and backfill investor URLs against the intended database:

```sh
npx prisma migrate deploy
npm run prisma-gen
npm run backfill-investors
```

The backfill requires Node 22.18 or later. It is transactional and safe to repeat. Investor names remain unchanged; `InvestorProfile` stores the stable URL mapping. Whitespace and punctuation become hyphens. Collisions receive a deterministic suffix. Uploads register new mappings in the same transaction as their holdings. Do not regenerate existing mappings when new names are added.

After backfilling an already running instance, clear its Redis `detail:` cache entries before enabling the new pages. Uploads invalidate this cache automatically. Existing list caches are enriched with the stored slugs on read.

## Checks

```sh
npm test
npx nuxt typecheck
npm run build
```

Check a fresh visit to `/saham/BBCA`, select an older period, follow an investor link, and return through a stock link. The selected period should remain consistent. Reloading the clean URL should show the latest period. Also check missing-period empty states, unknown entities, lowercase ticker redirects, large share counts, and the mobile tables.

The dynamic sitemap index and its three child sitemaps are documented in [sitemaps.md](sitemaps.md). History charts remain deferred.
