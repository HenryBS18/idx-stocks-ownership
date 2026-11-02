import { InvestorService } from "~~/server/services/investor.service"

const investorService = new InvestorService()

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)
    const { year, month } = await parseYearMonth(event)

    const [investors, slugs] = await Promise.all([investorService.getInvestors({ year, month }), getInvestorSlugMap()])
    return investors.map(investor => ({ ...investor, investorSlug: slugs.get(investor.investorName) ?? null }))
  } catch (error: any) {
    setResponseStatus(event, error.statusCode)
    return { message: error.message }
  }
})
