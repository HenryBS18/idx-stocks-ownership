import { SitemapService } from '../services/sitemap.service'
import type { SitemapName } from '../types'

const names = new Set<string>(['sitemap-pages', 'sitemap-stocks', 'sitemap-investors'])
const URLSET_OPENING_TAG = /<urlset[^>]*>/

export default defineNitroPlugin((nitroApp) => {
  const service = new SitemapService()
  nitroApp.hooks.hook('sitemap:sources', async (ctx) => {
    if (!names.has(ctx.sitemapName)) return
    // Let errors propagate: never publish an empty successful sitemap on a DB failure.
    const urls = await service.getEntries(ctx.sitemapName as SitemapName, useRuntimeConfig().sitemapContentDates)
    ctx.sources = [{ context: { name: 'ownership-data' }, urls }]
  })
  nitroApp.hooks.hook('sitemap:output', (ctx) => {
    ctx.sitemap = ctx.sitemap.replace(URLSET_OPENING_TAG, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  })
})
