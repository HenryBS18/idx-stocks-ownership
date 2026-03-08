(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export default defineEventHandler(async (event) => {
  try {
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
          }
        },
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