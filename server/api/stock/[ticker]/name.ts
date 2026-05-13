import { StockService } from "~~/server/services/stock.service"

const stockService = new StockService()

export default defineEventHandler(async (event) => {
  try {
    const ticker = getRouterParam(event, 'ticker')

    const stockName = await stockService.getStockName(ticker)

    if (!stockName) {
      setResponseStatus(event, 404)

      return {
        message: `${ticker} not found`
      }
    }

    return {
      name: stockName
    }
  } catch (error) {
    if (error instanceof Error) {
      setResponseStatus(event, 500)

      return {
        message: error.message
      }
    }
  }
})