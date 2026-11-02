import { DetailService } from '../../../services/detail.service'

const service = new DetailService()
export default defineEventHandler(async (event) => {
  requireAuth(event)
  const ticker = getRouterParam(event, 'ticker')?.toUpperCase() ?? ''
  if (!/^[A-Z0-9]{4}$/.test(ticker)) throw createError({ statusCode: 404, statusMessage: 'Saham tidak ditemukan' })
  return service.getDetail('stock', ticker, await parseYearMonth(event))
})
