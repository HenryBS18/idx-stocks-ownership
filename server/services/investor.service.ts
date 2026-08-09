import type { GetInvestorParam } from "../types"
import { getPrevMap, investorKey, round2 } from "../utils/investor-change"

export class InvestorService {
  async getInvestors({ year, month }: GetInvestorParam): Promise<InvestorPortfolio[]> {
    const cached = await getCache<InvestorPortfolio[]>(`investor:${year}-${month}`)
    if (cached) return cached

    const info = await prisma.info.findFirst({
      where: { month, year }
    })

    if (!info) throw new Error('Data tidak tersedia')

    const prevMap = await getPrevMap(info)
    const hasPrevData = prevMap !== null

    const investors = await prisma.stockInvestor.findMany({
      select: {
        investorName: true,
        investorType: true,
        localForeign: true,
        domicile: true,
        ticker: true,
        totalHoldingShare: true,
        percentage: true,
        stock: {
          select: {
            name: true
          }
        }
      },
      where: {
        infoId: info.id,
      },
      orderBy: {
        investorName: "asc"
      }
    })

    const portfolios: InvestorPortfolio[] = Object.values(
      investors.reduce<Record<string, InvestorPortfolio>>((acc, row) => {
        if (!acc[row.investorName]) {
          acc[row.investorName] = {
            investorName: row.investorName,
            investorType: row.investorType,
            localForeign: row.localForeign,
            domicile: row.domicile,
            stockCount: 0,
            stocks: []
          }
        }

        const percentage = parseFloat(row.percentage.toString())
        const key = investorKey(row.ticker, row.investorName)
        const prev = prevMap?.get(key)

        acc[row.investorName]?.stocks.push({
          ticker: row.ticker,
          name: row.stock.name,
          totalHoldingShare: parseInt(row.totalHoldingShare.toString()),
          percentage,
          change: prev === undefined ? null : round2(percentage - prev),
          hasPrevData,
        })

        return acc
      }, {})
    ).map((investor) => ({
      investorName: investor.investorName,
      investorType: getInvestorType(investor.investorType),
      localForeign: investor.localForeign === 'D' ? 'L' : investor.localForeign,
      domicile: investor.localForeign === 'F' ? investor.domicile : '',
      stockCount: investor.stocks.length,
      stocks: investor.stocks,
    }))

    portfolios.forEach(p => p.stocks.sort((a, b) => a.ticker.localeCompare(b.ticker)))

    await setCache(`investor:${year}-${month}`, portfolios)

    return portfolios
  }
}