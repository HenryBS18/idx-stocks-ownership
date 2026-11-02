import type { SitemapUrl } from '@nuxtjs/sitemap'
import type { SitemapContentDates, SitemapName } from '../types'

export type SitemapEntities = { tickers: string[]; slugs: string[] }

export const newestSitemapDate = (...dates: (string | null | undefined)[]): string | undefined => {
  const timestamps = dates.filter((date): date is string => !!date).map(Date.parse).filter(Number.isFinite)
  return timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : undefined
}

export const buildSitemapEntries = (
  name: SitemapName,
  entities: SitemapEntities,
  content: SitemapContentDates,
  batchDates: (string | null)[],
): SitemapUrl[] => {
  const dataDate = newestSitemapDate(...batchDates)
  const entry = (loc: string, date: string | undefined): SitemapUrl => ({ loc, ...(date ? { lastmod: date } : {}) })
  if (name === 'sitemap-pages') {
    const dataPages = new Set(['/', '/saham', '/investor'])
    return ['/', '/saham', '/investor', '/lisensi', '/privasi'].map(loc =>
      entry(loc, newestSitemapDate(content.pages[loc], dataPages.has(loc) ? dataDate : null)))
  }
  const isStock = name === 'sitemap-stocks'
  const identifiers = isStock ? entities.tickers.map(ticker => ticker.trim().toUpperCase()) : entities.slugs
  const lastmod = newestSitemapDate(dataDate, isStock ? content.stocks : content.investors)
  const path = isStock ? '/saham' : '/investor'
  return [...new Set(identifiers)].sort().map(identifier => entry(`${path}/${encodeURIComponent(identifier)}`, lastmod))
}
