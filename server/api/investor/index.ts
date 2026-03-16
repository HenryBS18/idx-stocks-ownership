import { InvestorStock } from "~~/server/types"
import { getLastDate } from "~~/server/utils/get-last-date"

export default defineCachedEventHandler(async (event) => {
  const { year, month } = getQuery(event)

  let yearInt: number
  let monthInt: number

  if (!year && !month) {
    const latestInfo = await prisma.info.findFirst({
      orderBy: [
        { year: "desc" },
        { month: "desc" }
      ]
    })

    if (!latestInfo) {
      setResponseStatus(event, 404)
      return { message: "Data tidak tersedia" }
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
      month: monthInt,
      year: yearInt,
    }
  })

  if (!info) {
    setResponseStatus(event, 404)
    return { message: "Data tidak tersedia" }
  }

  if (yearInt < 2026 || (yearInt === 2026 && monthInt < 2)) {
    setResponseStatus(event, 404)
    return { message: "Data dibawah februari 2026 tidak tersedia" }
  }

  const investors = await prisma.stockInvestor.findMany({
    select: {
      investorName: true,
      ticker: true,
      totalHoldingShare: true,
      percentage: true,
      stock: {
        select: {
          name: true
        }
      }
    },
    where: {
      infoId: info.id,
    },
    orderBy: {
      investorName: "asc"
    }
  })

  const investorStock: InvestorStock[] = Object.values(
    investors.reduce<Record<string, InvestorStock>>((acc, row) => {
      if (!acc[row.investorName]) {
        acc[row.investorName] = {
          investorName: row.investorName,
          stocks: []
        }
      }

      acc[row.investorName]?.stocks.push({
        ticker: row.ticker,
        name: row.stock.name,
        totalHoldingShare: parseInt(row.totalHoldingShare.toString()),
        percentage: parseFloat(row.percentage.toString())
      })

      return acc
    }, {})
  )

  return {
    lastUpdated: getLastDate(info.month, info.year),
    data: investorStock,
  }
}, {
  maxAge: 60 * 60 * 1,
  getKey: (event) => {
    const { year, month } = getQuery(event)
    return `investor-${year ?? "latest"}-${month ?? "latest"}`
  }
})