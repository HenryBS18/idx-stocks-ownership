import { StockService } from "~~/server/services/stock.service"
import { invalidateCacheByPrefix } from "~~/server/utils/cache"
import { parseHscPayload } from "~~/server/utils/parse-hsc-payload"

const stockService = new StockService()

export default defineEventHandler(async (event) => {
  try {
    requirePostSecret(event)
    const payload = parseHscPayload(await readBody(event))

    const result = await stockService.upsertHsc(payload)
    await invalidateCacheByPrefix('stock')
    await invalidateCacheByPrefix('landing')
    await invalidateCacheByPrefix('detail')
    await invalidateCacheByPrefix('sitemap')

    return { message: 'Updated', ...result }
  } catch (error: any) {
    setResponseStatus(event, error.statusCode ?? 500)
    return { message: error.statusMessage ?? error.message }
  }
})
