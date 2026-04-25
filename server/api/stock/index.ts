import { StockService } from "~~/server/services/stock.service"

const stockService = new StockService()

export default defineCachedEventHandler(async (event) => {
  try {
    const token = getQuery(event).token?.toString()

    const tokenVerified = verifyToken(token)

    if (!tokenVerified) {
      setResponseStatus(event, 401)

      return { message: 'Unauthorized: Token tidak valid.' }
    }

    const { year, month } = getQuery(event)

    let yearInt: number
    let monthInt: number

    if (!year && !month) {
      const latestInfo = await prisma.info.findFirst({
        orderBy: [
          { year: 'desc' },
          { month: 'desc' }
        ]
      })

      if (!latestInfo) {
        setResponseStatus(event, 404)
        return { message: 'Data tidak tersedia' }
      }

      yearInt = latestInfo.year
      monthInt = latestInfo.month
    } else {
      yearInt = parseInt(year!.toString(), 10)
      monthInt = parseInt(month!.toString(), 10)

      if (isNaN(yearInt) || isNaN(monthInt)) {
        setResponseStatus(event, 400)
        return { message: "Year dan month harus berupa angka" }
      }

      if (monthInt < 1 || monthInt > 12) {
        setResponseStatus(event, 400)
        return { message: "Month harus antara 1 - 12" }
      }
    }

    const stocks = await stockService.getStock({
      year: yearInt,
      month: monthInt
    })

    return stocks
  } catch (error) {
    if (error instanceof Error) {
      setResponseStatus(event, 500)

      return {
        message: error.message
      }
    }
  }
}, {
  maxAge: 60 * 60 * 24,
  getKey: (event) => {
    const { year, month, token } = getQuery(event)
    return `stock-${token}-${year ?? 'latest'}-${month ?? 'latest'}`
  }
})