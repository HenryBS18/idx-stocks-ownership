import { StockService } from "~~/server/services/stock.service"
import { invalidateCache } from "~~/server/utils/cache"

const stockService = new StockService()

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)
    const { fileBuffer, idxLastUpdated } = await parseStockUpload(event)

    await stockService.insertStockCsv({ fileBuffer, idxLastUpdated })
    await invalidateCache('infos')
    await invalidateCache('stock:ticker-names')

    return { message: 'Created' }
  } catch (error: any) {
    setResponseStatus(event, error.statusCode)
    return { message: error.message }
  }
})
