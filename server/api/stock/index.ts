import { StockService } from "~~/server/services/stock.service"

const stockService = new StockService()

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)
    const { year, month } = await parseYearMonth(event)

    return await stockService.getStocks({ year, month })
  } catch (error: any) {
    setResponseStatus(event, error.statusCode)
    return { message: error.message }
  }
})
