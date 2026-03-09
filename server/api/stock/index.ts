export default defineEventHandler(async (event) => {
  try {
    const { year, month } = getQuery(event)

    const date = new Date()
    const yearInt = year ? parseInt(year.toString(), 10) : date.getFullYear()
    const monthInt = month ? parseInt(month.toString(), 10) : date.getMonth() + 1

    if (isNaN(yearInt) || isNaN(monthInt)) {
      setResponseStatus(event, 400)

      return {
        message: "Year dan month harus berupa angka"
      }
    }

    if (monthInt < 1 || monthInt > 12) {
      setResponseStatus(event, 400)

      return {
        message: "Month harus antara 1 - 12"
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

      return {
        message: 'Data tidak tersedia'
      }
    }

    if (yearInt > info.year || (yearInt === info.year && monthInt > info.month)) {
      setResponseStatus(event, 404)

      return {
        message: 'Data belum tersedia'
      }
    }

    if (yearInt < 2026 || (yearInt === 2026 && monthInt < 2)) {
      setResponseStatus(event, 404)

      return {
        message: 'Data dibawah februari 2026 tidak tersedia'
      }
    }

    return await prisma.stock.findMany({
      select: {
        ticker: true,
        name: true,
        stockInvestor: {
          select: {
            investorName: true,
            investorType: true,
            localForeign: true,
            domicile: true,
            scripless: true,
            scrip: true,
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
  } catch (error) {
    if (error instanceof Error) {
      setResponseStatus(event, 500)

      return {
        message: error.message
      }
    }
  }
})