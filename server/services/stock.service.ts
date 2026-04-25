import { GetStockParam, InsertStockParam, Stock, StockInvestor, StockInvestors, TickerName } from "../types"

export class StockService {
  async getStock({ year, month }: GetStockParam): Promise<StockInvestors> {
    const cachedStock = await getCache<StockInvestors>(`stock:${year}-${month}`)
    if (cachedStock) return cachedStock

    const info = await prisma.info.findFirst({
      where: { year, month }
    })

    if (!info) throw new Error('Data tidak tersedia')

    const stocksQuery = await prisma.stock.findMany({
      select: {
        ticker: true,
        name: true,
        stockInvestor: {
          select: {
            investorName: true,
            investorType: true,
            localForeign: true,
            domicile: true,
            totalHoldingShare: true,
            percentage: true,
          },
          where: {
            infoId: info.id,
          }
        },
      },
      orderBy: {
        ticker: 'asc'
      },
    })

    const stocks: StockInvestors = stocksQuery.map((s) => {
      const investorCount = s.stockInvestor.length

      const float = parseFloat(
        s.stockInvestor
          .reduce((acc, curr) => acc + parseFloat(curr.percentage.toString()), 0)
          .toFixed(2)
      )

      const freeFloat = parseFloat((100 - float).toFixed(2))

      return {
        ticker: s.ticker,
        name: s.name,
        investorCount,
        float,
        freeFloat,
        investors: s.stockInvestor.map((investor) => ({
          ...investor,
          investorType: getInvestorType(investor.investorType),
          localForeign: getLocalForeign(investor.localForeign),
          totalHoldingShare: parseInt(investor.totalHoldingShare.toString()),
          percentage: parseFloat(investor.percentage.toString()),
        })),
      }
    })

    await setCache(`stock:${year}-${month}`, stocks)

    return stocks
  }

  async insertStock({ fileBuffer, idxLastUpdated }: InsertStockParam): Promise<void> {
    const dataJson = JSON.parse(fileBuffer!.toString()) as StockInvestor[]

    const { month, year } = datetimeParser(idxLastUpdated)

    await prisma.$transaction(async (tx) => {
      const newInfo = await tx.info.create({
        data: {
          idxLastUpdated,
          month: month - 1,
          year
        }
      })

      const stockRaw: StockInvestor[] = dataJson.map((stock) => ({
        ...stock,
        infoId: newInfo.id
      }))

      const seenTickers = new Set<string>()
      const tickerName: TickerName[] = []

      for (const { ticker, name } of stockRaw) {
        if (!seenTickers.has(ticker)) {
          seenTickers.add(ticker)
          tickerName.push({ ticker, name })
        }
      }

      await tx.stock.createMany({
        data: tickerName,
        skipDuplicates: true,
      })

      const stock: Stock[] = stockRaw.map(({
        infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
      }) => ({
        infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
      }))

      const chunk = 1000
      for (let i = 0; i < stock.length; i += chunk) {
        await tx.stockInvestor.createMany({
          data: stock.slice(i, i + chunk),
          skipDuplicates: true
        })
      }
    }, {
      timeout: 1000 * 60
    })
  }
}