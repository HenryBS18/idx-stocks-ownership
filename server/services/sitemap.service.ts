import type { Prisma } from '../generated/prisma/client'
import type { SitemapContentDates, SitemapName } from '../types'
import { buildSitemapEntries, type SitemapEntities } from '../utils/sitemap-data'

const newest = [{ year: 'desc' }, { month: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }] satisfies Prisma.InfoOrderByWithRelationInput[]
const batchFields = { id: true, year: true, month: true, createdAt: true } as const

export class SitemapService {
  async getEntries(name: SitemapName, content: SitemapContentDates) {
    // Re-read lightweight metadata so concurrent uploads cannot restore a stale URL set.
    const current = await prisma.info.findFirst({ orderBy: newest, select: batchFields })
    if (!current) return buildSitemapEntries(name, { tickers: [], slugs: [] }, content, [])
    const previous = await prisma.info.findFirst({
      where: { OR: [{ year: { lt: current.year } }, { year: current.year, month: { lt: current.month } }] },
      orderBy: newest, select: batchFields,
    })
    const cacheKey = `sitemap:entities:${current.id}`
    let entities = await getCache<SitemapEntities>(cacheKey)
    if (!entities) {
      const [stocks, investors] = await Promise.all([
        prisma.stock.findMany({ where: { stockInvestor: { some: { infoId: current.id } } }, select: { ticker: true } }),
        prisma.$queryRaw<{ slug: string }[]>`
          SELECT DISTINCT p."slug"
          FROM "InvestorProfile" p
          JOIN "StockInvestor" h ON h."investorName" = p."investorName"
          WHERE h."infoId" = ${current.id}
        `,
      ])
      entities = { tickers: stocks.map(stock => stock.ticker), slugs: investors.map(investor => investor.slug) }
      await setCache(cacheKey, entities)
    }
    return buildSitemapEntries(name, entities, content, [current.createdAt.toISOString(), previous?.createdAt.toISOString() ?? null])
  }
}
