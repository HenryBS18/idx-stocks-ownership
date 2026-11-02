# Sitemaps

`/sitemap.xml` serves the sitemap index directly. Its three children are:

- `/sitemap-pages.xml`: the five main pages.
- `/sitemap-stocks.xml`: stocks with holdings in the latest reporting period.
- `/sitemap-investors.xml`: persisted investor slugs with holdings in that period.

Historical-only entities remain accessible through the site but are excluded from
the sitemaps. Detail URLs contain no period, filter, or visitor-token parameters.
No database migration or backfill is needed for this feature.

## Runtime behavior

Nuxt Sitemap generates XML from the `sitemap:sources` Nitro hook. The service reads
the latest and previous reporting batches using the same ordering as detail pages.
It caches only the entity identifiers in Redis under `sitemap:entities:<infoId>`.
Uploads invalidate the `sitemap` prefix after committing. Batch-specific keys also
prevent an in-flight request for an old batch from restoring the active URL list.

Module and HTTP XML caching are disabled. Requests re-read batch metadata, so a
later backfill of the comparison period can update `lastmod` immediately. Database
or cache failures propagate as errors rather than successful empty XML. A database
with no batches legitimately produces empty detail sitemaps.

`lastmod` is the newest relevant current/previous batch `createdAt` or committed
content date. Legal pages use their content commit date only. Missing commit
metadata is omitted; neither build time nor request time is substituted. Dates for
uncommitted source edits become available after the edits are committed and built.
Direct database edits bypass upload invalidation and do not have reliable update
timestamps in the current schema.

## Routing and deployment

The local `sitemap-root` Nuxt module reuses Nuxt Sitemap's index handler at
`/sitemap.xml` and reverses its default redirect. `/sitemap_index.xml` redirects
permanently to `/sitemap.xml`. The adapter fails the build if the expected module
routes change during a dependency upgrade.

Keep `NUXT_PUBLIC_SITE_URL` set to the canonical production origin. Keep the
existing `/sitemap.xml` entry in `robots.txt` and Search Console; the children do
not need individual submissions. After deployment, check that the index returns
200 without redirecting, each child contains absolute production URLs, and
representative detail URLs render without a pre-existing visitor cookie.

These are runtime sitemaps for the server deployment, not static prerendered files.
The current content groups fit within sitemap size limits; revisit chunking before
either child reaches 50,000 URLs or 50 MB uncompressed.
