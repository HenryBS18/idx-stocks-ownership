import { StockService } from "~~/server/services/stock.service"

const stockService = new StockService()

export default defineEventHandler(async (event) => {
  try {
    const stocks = await stockService.getStockTickerNameList()

    return stocks
  } catch (error) {
    if (error instanceof Error) {
      setResponseStatus(event, 500)

      return {
        message: error.message
      }
    }
  }
})