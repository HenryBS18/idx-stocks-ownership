import { DetailService } from '../../services/detail.service'

const service = new DetailService()
export default defineEventHandler(async (event) => {
  requireAuth(event)
  const slug = getRouterParam(event, 'slug') ?? ''
  if (!/^[a-z0-9-]{1,220}$/.test(slug)) throw createError({ statusCode: 404, statusMessage: 'Investor tidak ditemukan' })
  return service.getDetail('investor', slug, await parseYearMonth(event))
})
