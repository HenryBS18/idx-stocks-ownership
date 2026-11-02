import { StockService } from "~~/server/services/stock.service"

const stockService = new StockService()

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)
    const { year, month } = await parseYearMonth(event)

    const [stocks, slugs] = await Promise.all([stockService.getStocks({ year, month }), getInvestorSlugMap()])
    return stocks.map(stock => ({
      ...stock,
      investors: stock.investors.map(investor => ({ ...investor, investorSlug: slugs.get(investor.investorName) ?? null })),
    }))
  } catch (error: any) {
    setResponseStatus(event, error.statusCode)
    return { message: error.message }
  }
})
