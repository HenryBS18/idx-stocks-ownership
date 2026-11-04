import type { DetailPeriod, OwnershipDetail } from '../../shared/types/detail'
import type { Prisma } from '../generated/prisma/client'
import { compareHoldings, type DetailRecord } from '../utils/ownership-detail'
import { sortStockInvestors } from '../utils/sort-stock-investors'

type Batch = { id: number; year: number; month: number; idxLastUpdated: string; createdAt: Date }
const period = (info: Batch): DetailPeriod => ({
  value: `${info.year}-${info.month}`,
  label: getLastDate(info.month, info.year),
  idxLastUpdated: info.idxLastUpdated,
  createdAt: info.createdAt.toISOString(),
})
const newest = [{ year: 'desc' }, { month: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }] satisfies Prisma.InfoOrderByWithRelationInput[]

export class DetailService {
  async getDetail(kind: 'stock' | 'investor', identifier: string, date: { year: number; month: number }): Promise<OwnershipDetail> {
    const cacheKey = `detail:${kind}:${identifier}:${date.year}-${date.month}`
    const cached = await getCache<OwnershipDetail>(cacheKey)
    if (cached) return cached

    const stock = kind === 'stock' ? await prisma.stock.findUnique({ where: { ticker: identifier } }) : null
    const investor = kind === 'investor' ? await prisma.investorProfile.findUnique({ where: { slug: identifier } }) : null
    if (!stock && !investor) throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' })

    const filter: Prisma.StockInvestorWhereInput = stock ? { ticker: stock.ticker } : { investorName: investor!.investorName }
    const [info, latest] = await Promise.all([
      prisma.info.findFirst({ where: date, orderBy: newest }),
      prisma.info.findFirst({ where: { stockInvestor: { some: filter } }, orderBy: newest }),
    ])
    if (!info) throw createError({ statusCode: 404, statusMessage: 'Periode tidak tersedia' })
    const previous = await prisma.info.findFirst({
      where: { OR: [{ year: info.year, month: { lt: info.month } }, { year: { lt: info.year } }] },
      orderBy: newest,
    })
    const records = await prisma.stockInvestor.findMany({
      where: { ...filter, infoId: { in: [info.id, ...(previous ? [previous.id] : [])] } },
      select: {
        infoId: true, ticker: true, investorName: true, investorType: true,
        controllerOrAffiliate: true,
        localForeign: true, domicile: true, totalHoldingShare: true, percentage: true,
        stock: { select: { name: true } },
      },
      orderBy: [{ ticker: 'asc' }, { investorName: 'asc' }, { id: 'asc' }],
    })
    const slugs = await getInvestorSlugMap()
    const toRecord = (row: typeof records[number]): DetailRecord => ({
      ticker: row.ticker,
      stockName: row.stock.name,
      sector: getSectorByTicker(row.ticker),
      investorName: row.investorName,
      investorSlug: slugs.get(row.investorName) ?? null,
      investorType: getInvestorType(row.investorType),
      controllerOrAffiliate: row.controllerOrAffiliate,
      localForeign: row.localForeign.trim() === 'L' ? 'D' : row.localForeign.trim(),
      domicile: row.domicile,
      totalHoldingShare: row.totalHoldingShare.toString(),
      percentage: Number(row.percentage),
    })
    const comparison = compareHoldings(
      records.filter(row => row.infoId === info.id).map(toRecord),
      previous ? records.filter(row => row.infoId === previous.id).map(toRecord) : null,
    )
    comparison.holdings = kind === 'stock'
      ? sortStockInvestors(comparison.holdings)
      : comparison.holdings.sort((a, b) => a.ticker.localeCompare(b.ticker))
    const representative = comparison.holdings[0]
    const total = stock && comparison.holdings.length
      ? Math.round(comparison.holdings.reduce((sum, row) => sum + row.percentage, 0) * 100) / 100 : null
    const result: OwnershipDetail = {
      kind,
      identity: {
        name: stock?.name ?? investor!.investorName,
        ticker: stock?.ticker ?? null,
        slug: investor?.slug ?? null,
        sector: stock ? getSectorByTicker(stock.ticker) : null,
        investorType: investor ? representative?.investorType ?? null : null,
        localForeign: investor ? representative?.localForeign ?? null : null,
        domicile: investor ? representative?.domicile ?? null : null,
      },
      period: period(info),
      previousPeriod: previous ? period(previous) : null,
      latestAvailablePeriod: latest ? period(latest) : null,
      ...comparison,
      recordedOwnership: total,
      freeFloat: total === null ? null : Math.round((100 - total) * 100) / 100,
    }
    await setCache(cacheKey, result)
    return result
  }
}
