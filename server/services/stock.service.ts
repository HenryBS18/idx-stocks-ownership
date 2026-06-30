import fs from "fs"
import os from "os"
import path from "path"
import type { GetStockParam, InsertStockParam, HoldingRecord, InvestorHolding, StockHolding, TickerName } from "../types"

export class StockService {
  async getStocks({ year, month }: GetStockParam): Promise<StockDetail[]> {
    const cached = await getCache<StockDetail[]>(`stock:${year}-${month}`)
    if (cached) return cached

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

    const stockDetails: StockDetail[] = stocksQuery.map((s) => {
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

    await setCache(`stock:${year}-${month}`, stockDetails)

    return stockDetails
  }

  async getStockName(ticker: string | undefined): Promise<string | null> {
    const stock = await prisma.stock.findFirst({
      where: {
        ticker: ticker?.toUpperCase()
      }
    })

    if (!stock) return null

    return stock.name
  }

  async getStockTickerNameList(): Promise<TickerName[]> {
    const stocks = await prisma.stock.findMany({
      select: {
        ticker: true,
        name: true,
      },
    })

    return stocks
  }

  async insertStock({ fileBuffer, idxLastUpdated }: InsertStockParam): Promise<void> {
    const dataJson = JSON.parse(fileBuffer!.toString()) as StockHolding[]

    const { month, year } = datetimeParser(idxLastUpdated)

    await prisma.$transaction(async (tx) => {
      const newInfo = await tx.info.create({
        data: {
          idxLastUpdated,
          month: month - 1,
          year
        }
      })

      const holdings: StockHolding[] = dataJson.map((stock) => ({
        ...stock,
        infoId: newInfo.id
      }))

      const seenTickers = new Set<string>()
      const tickerNames: TickerName[] = []

      for (const { ticker, name } of holdings) {
        if (!seenTickers.has(ticker)) {
          seenTickers.add(ticker)
          tickerNames.push({ ticker, name })
        }
      }

      await tx.stock.createMany({
        data: tickerNames,
        skipDuplicates: true,
      })

      const records: HoldingRecord[] = holdings.map(({
        infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
      }) => ({
        infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
      }))

      const chunk = 1000
      for (let i = 0; i < records.length; i += chunk) {
        await tx.stockInvestor.createMany({
          data: records.slice(i, i + chunk),
          skipDuplicates: true
        })
      }
    }, {
      timeout: 1000 * 60
    })
  }

  async insertStockCsv(fileBuffer: Buffer, idxLastUpdated: string): Promise<void> {
    const tempFilePath = path.join(os.tmpdir(), `csv-${Date.now()}.csv`)
    fs.writeFileSync(tempFilePath, fileBuffer)

    let investorHoldings: InvestorHolding[]
    try {
      investorHoldings = await parseCsv(tempFilePath)
    } finally {
      fs.unlinkSync(tempFilePath)
    }

    const { month, year } = datetimeParser(idxLastUpdated)

    await prisma.$transaction(async (tx) => {
      const newInfo = await tx.info.create({
        data: {
          idxLastUpdated,
          month: month - 1,
          year
        }
      })

      const seenTickers = new Set<string>()
      const tickerNames: TickerName[] = []

      for (const { ticker, name } of investorHoldings) {
        if (!seenTickers.has(ticker)) {
          seenTickers.add(ticker)
          tickerNames.push({ ticker, name })
        }
      }

      await tx.stock.createMany({
        data: tickerNames,
        skipDuplicates: true,
      })

      const records: HoldingRecord[] = investorHoldings.map(({
        ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
      }) => ({
        ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage,
        infoId: newInfo.id
      }))

      const chunk = 1000
      for (let i = 0; i < records.length; i += chunk) {
        await tx.stockInvestor.createMany({
          data: records.slice(i, i + chunk),
          skipDuplicates: true
        })
      }
    }, {
      timeout: 1000 * 60
    })
  }
}