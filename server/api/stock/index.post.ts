import { StockService } from "~~/server/services/stock.service"
import { invalidateCache, invalidateCacheByPrefix } from "~~/server/utils/cache"

const stockService = new StockService()

export default defineEventHandler(async (event) => {
  try {
    requirePostSecret(event)
    const { fileBuffer, idxLastUpdated } = await parseStockUpload(event)

    await stockService.insertStock({ fileBuffer, idxLastUpdated })
    await invalidateCache('infos')
    await invalidateCache('stock:ticker-names')
    await invalidateCacheByPrefix('landing')
    await invalidateCacheByPrefix('detail')
    await invalidateCacheByPrefix('sitemap')

    return { message: 'Created' }
  } catch (error: any) {
    setResponseStatus(event, error.statusCode)
    return { message: error.message }
  }
})
