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
  hscDate: string | null = null,
): SitemapUrl[] => {
  const dataDate = newestSitemapDate(...batchDates)
  const entry = (loc: string, date: string | undefined): SitemapUrl => ({ loc, ...(date ? { lastmod: date } : {}) })
  if (name === 'sitemap-pages') {
    const dataPages = new Set(['/', '/saham', '/investor'])
    const hscPages = new Set(['/', '/saham', '/hsc'])
    return ['/', '/saham', '/investor', '/hsc', '/lisensi', '/privasi'].map(loc =>
      entry(loc, newestSitemapDate(content.pages[loc], dataPages.has(loc) ? dataDate : null, hscPages.has(loc) ? hscDate : null)))
  }
  const isStock = name === 'sitemap-stocks'
  const identifiers = isStock ? entities.tickers.map(ticker => ticker.trim().toUpperCase()) : entities.slugs
  const lastmod = isStock
    ? newestSitemapDate(dataDate, content.stocks, hscDate)
    : newestSitemapDate(dataDate, content.investors)
  const path = isStock ? '/saham' : '/investor'
  return [...new Set(identifiers)].sort().map(identifier => entry(`${path}/${encodeURIComponent(identifier)}`, lastmod))
}
