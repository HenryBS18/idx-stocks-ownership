import fs from "fs"
import os from "os"
import path from "path"
import type { GetStockParam, HoldingRecord, InsertStockParam, InvestorHolding, StockHolding, TickerName, Tx } from "../types"

export class StockService {
  async getStocks({ year, month }: GetStockParam): Promise<StockDetail[]> {
    const cached = await getCache<StockDetail[]>(`stock:${year}-${month}`)
    if (cached) return cached

    const info = await prisma.info.findFirst({
      where: { year, month }
    })

    if (!info) throw new Error('Data tidak tersedia')

    const stocks = await prisma.stock.findMany({
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

    const stockDetails: StockDetail[] = stocks.map((s) => {
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
    const stockData = JSON.parse(fileBuffer.toString()) as StockHolding[]
    const { month, year } = parseDateTime(idxLastUpdated)

    await prisma.$transaction(async (tx) => {
      const newInfo = await tx.info.create({
        data: { idxLastUpdated, month: month - 1, year }
      })

      const holdings = stockData.map((s) => ({ ...s, infoId: newInfo.id }))
      const tickerNames = this.dedupTickers(holdings)
      await tx.stock.createMany({ data: tickerNames, skipDuplicates: true })

      const records: HoldingRecord[] = holdings.map((
        { infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage }
      ) => ({ infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage }))

      await this.batchInsertRecords(tx, records)
    }, { timeout: 1000 * 60 })
  }

  async insertStockCsv({ fileBuffer, idxLastUpdated }: InsertStockParam): Promise<void> {
    const tempFilePath = path.join(os.tmpdir(), `csv-${Date.now()}.csv`)
    fs.writeFileSync(tempFilePath, fileBuffer)

    let investorHoldings: InvestorHolding[]
    try {
      investorHoldings = await parseCsv(tempFilePath)
    } finally {
      fs.unlinkSync(tempFilePath)
    }

    const { month, year } = parseDateTime(idxLastUpdated)

    await prisma.$transaction(async (tx) => {
      const newInfo = await tx.info.create({
        data: { idxLastUpdated, month: month - 1, year }
      })

      const tickerNames = this.dedupTickers(investorHoldings)
      await tx.stock.createMany({ data: tickerNames, skipDuplicates: true })

      const records: HoldingRecord[] = investorHoldings.map((
        { ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage }
      ) => ({ ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage, infoId: newInfo.id }))

      await this.batchInsertRecords(tx, records)
    }, { timeout: 1000 * 60 })
  }

  private dedupTickers(holdings: Array<{ ticker: string; name: string }>): TickerName[] {
    const seen = new Set<string>()
    const names: TickerName[] = []
    for (const { ticker, name } of holdings) {
      if (!seen.has(ticker)) {
        seen.add(ticker)
        names.push({ ticker, name })
      }
    }
    return names
  }

  private async batchInsertRecords(tx: Tx, records: HoldingRecord[]): Promise<void> {
    for (let i = 0; i < records.length; i += 1000) {
      await tx.stockInvestor.createMany({
        data: records.slice(i, i + 1000),
        skipDuplicates: true
      })
    }
  }
}