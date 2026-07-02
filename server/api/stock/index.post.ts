import { StockService } from "~~/server/services/stock.service"
import { invalidateCache } from "~~/server/utils/cache"

const stockService = new StockService()

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)
    const { fileBuffer, idxLastUpdated } = await parseStockUpload(event)

    await stockService.insertStock({ fileBuffer, idxLastUpdated })
    await invalidateCache('infos')

    return { message: 'Created' }
  } catch (error: any) {
    setResponseStatus(event, error.statusCode)
    return { message: error.message }
  }
})
