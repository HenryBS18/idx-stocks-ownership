# Stock and investor detail pages

Detail pages use the shared date selector. A new browser visit opens the latest reporting period; navigation within the app keeps the selected date. URLs do not encode that date. Unknown entities return 404, while known entities without records for a period show an empty state.

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
