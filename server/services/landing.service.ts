import { getCache, setCache } from "~~/server/utils/cache"
import type { InfoBatch, InfoPeriod, TeaserStock } from "../types"
import { round2 } from "../utils/investor-change"
import { getInvestorSlugMap } from "../utils/investor-profiles"
import { sortStockInvestors } from "../utils/sort-stock-investors"

const FALLBACK_TICKER = 'BBCA'
const TEASER_ROW_LIMIT = 25

const toIsoMonth = (period: InfoPeriod): string =>
  `${period.year}-${String(period.month).padStart(2, '0')}`

export class LandingService {
  async getTeaser(): Promise<LandingTeaser> {
    const [info, earliest] = await Promise.all([
      prisma.info.findFirst({
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
      }),
      prisma.info.findFirst({
        orderBy: [{ year: 'asc' }, { month: 'asc' }],
      }),
    ])

    if (!info) return { batchLabel: '', emitenCount: 0, coverage: null, stock: null }

    const cacheKey = `landing:${info.year}-${info.month}`
    const cached = await getCache<LandingTeaser>(cacheKey)
    if (cached) return this.withInvestorSlugs(cached)

    const ticker = await this.getDeepestTicker(info.id)

    const [stock, emitenCount] = await Promise.all([
      prisma.stock.findFirst({
        where: { ticker },
        select: {
          ticker: true,
          name: true,
          stockInvestor: {
            select: {
              investorName: true,
              investorType: true,
              controllerOrAffiliate: true,
              localForeign: true,
              domicile: true,
              totalHoldingShare: true,
              percentage: true,
            },
            where: { infoId: info.id },
            orderBy: { percentage: 'desc' },
          },
        },
      }),
      prisma.stock.count(),
    ])

    const teaser: LandingTeaser = {
      batchLabel: getLastDate(info.month, info.year),
      emitenCount,
      coverage: earliest ? { start: toIsoMonth(earliest), end: toIsoMonth(info) } : null,
      stock: stock && stock.stockInvestor.length > 0
        ? await this.toStockDetail(stock, info)
        : null,
    }

    await setCache(cacheKey, teaser)

    return this.withInvestorSlugs(teaser)
  }

  private async withInvestorSlugs(teaser: LandingTeaser): Promise<LandingTeaser> {
    if (!teaser.stock) return teaser

    const slugs = await getInvestorSlugMap()
    return {
      ...teaser,
      stock: {
        ...teaser.stock,
        investors: teaser.stock.investors.map(investor => ({
          ...investor,
          investorSlug: slugs.get(investor.investorName) ?? null,
        })),
      },
    }
  }

  private async getDeepestTicker(infoId: number): Promise<string> {
    const [deepest] = await prisma.stockInvestor.groupBy({
      by: ['ticker'],
      where: { infoId },
      _count: { ticker: true },
      orderBy: { _count: { ticker: 'desc' } },
      take: 1,
    })

    return deepest?.ticker ?? FALLBACK_TICKER
  }

  private async toStockDetail(stock: TeaserStock, info: InfoBatch): Promise<StockDetail> {
    const prevMap = await this.getPrevTickerMap(stock.ticker, info)
    const hasPrevData = prevMap !== null

    const float = parseFloat(
      stock.stockInvestor
        .reduce((acc, curr) => acc + parseFloat(String(curr.percentage)), 0)
        .toFixed(2)
    )

    return {
      ticker: stock.ticker,
      name: stock.name,
      sector: getSectorByTicker(stock.ticker),
      investorCount: stock.stockInvestor.length,
      float,
      freeFloat: parseFloat((100 - float).toFixed(2)),
      investors: sortStockInvestors(stock.stockInvestor.map((investor) => {
        const percentage = parseFloat(String(investor.percentage))

        return {
          investorName: investor.investorName,
          investorType: getInvestorType(investor.investorType),
          controllerOrAffiliate: investor.controllerOrAffiliate,
          localForeign: investor.localForeign === 'L' ? 'D' : investor.localForeign,
          domicile: investor.domicile,
          totalHoldingShare: parseInt(investor.totalHoldingShare.toString()),
          percentage,
          hasPrevData,
          change: prevMap
            ? (prevMap.has(investor.investorName)
              ? round2(percentage - prevMap.get(investor.investorName)!)
              : null)
            : null,
        }
      })).slice(0, TEASER_ROW_LIMIT),
    }
  }

  private async getPrevTickerMap(ticker: string, info: InfoPeriod): Promise<Map<string, number> | null> {
    const prevInfo = await prisma.info.findFirst({
      where: {
        OR: [
          { year: info.year, month: { lt: info.month } },
          { year: { lt: info.year } },
        ],
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    })

    if (!prevInfo) return null

    const prevHoldings = await prisma.stockInvestor.findMany({
      where: { infoId: prevInfo.id, ticker },
      select: { investorName: true, percentage: true },
    })

    return new Map(prevHoldings.map((h) => [h.investorName, parseFloat(h.percentage.toString())]))
  }
}
