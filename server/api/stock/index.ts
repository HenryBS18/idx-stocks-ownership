import { verifyToken } from "~~/server/utils/verify-token"

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

    const info = await prisma.info.findFirst({
      where: {
        year: yearInt,
        month: monthInt
      }
    })

    if (!info) {
      setResponseStatus(event, 404)
      return { message: 'Data tidak tersedia' }
    }

    const stocksQuery = await prisma.stock.findMany({
      select: {
        ticker: true,
        name: true,
        stockInvestor: {
          select: {
            investorName: true,
            investorType: true,
            localForeign: true,
            domicile: true,
            totalHoldingShare: true,
            percentage: true,
          },
          where: {
            infoId: info.id,
          }
        },
      },
      orderBy: {
        ticker: 'asc'
      },
    })

    const stocks = stocksQuery.map((s) => {
      const investorCount = s.stockInvestor.length

      const float = parseFloat(
        s.stockInvestor
          .reduce((acc, curr) => acc + parseFloat(curr.percentage.toString()), 0)
          .toFixed(2)
      )

      const freeFloat = parseFloat((100 - float).toFixed(2))

      return {
        ticker: s.ticker,
        name: s.name,
        investorCount,
        float,
        freeFloat,
        investors: s.stockInvestor.map((investor) => ({
          ...investor,
          investorType: getInvestorType(investor.investorType),
          localForeign: getLocalForeign(investor.localForeign),
          totalHoldingShare: parseInt(investor.totalHoldingShare.toString()),
          percentage: parseFloat(investor.percentage.toString()),
        })),
      }
    })

    return {
      lastUpdated: getLastDate(info.month, info.year),
      data: stocks
    }

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