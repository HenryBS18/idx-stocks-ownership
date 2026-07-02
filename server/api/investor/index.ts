import { InvestorService } from "~~/server/services/investor.service"

const investorService = new InvestorService()

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)
    const { year, month } = await parseYearMonth(event)

    return await investorService.getInvestors({ year, month })
  } catch (error: any) {
    setResponseStatus(event, error.statusCode)
    return { message: error.message }
  }
})
