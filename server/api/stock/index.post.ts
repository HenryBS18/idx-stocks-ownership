import { Stock, StockInvestor, TickerName } from "~~/server/types"

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token?.toString()

  const tokenVerified = verifyToken(token)

  if (!tokenVerified) {
    setResponseStatus(event, 401)

    return { message: 'Unauthorized: Token tidak valid.' }
  }

  const formData = await readMultipartFormData(event)

  if (!formData) return {
    message: 'Formdata is required'
  }

  try {
    const filePart = formData.find(p => p.name === "file")
    const idxPart = formData.find(p => p.name === "idxLastUpdated")

    if (!filePart) {
      setResponseStatus(event, 500)
      return { message: "file missing" }
    }

    if (!idxPart) {
      setResponseStatus(event, 400)
      return { message: "idxLastUpdated missing" }
    }

    const idxLastUpdated = idxPart!.data.toString()

    if (!idxLastUpdated) {
      setResponseStatus(event, 400)
      return { message: 'idxLastUpated not valid' }
    }

    const info = await prisma.info.findFirst({
      where: { idxLastUpdated }
    })

    if (info) {
      return { message: 'Already Updated to the Latest Data' }
    }

    const fileBuffer = filePart?.data
    const dataJson = JSON.parse(fileBuffer!.toString()) as StockInvestor[]

    const { month, year } = datetimeParser(idxLastUpdated)

    await prisma.$transaction(async (tx) => {
      const newInfo = await tx.info.create({
        data: {
          idxLastUpdated,
          month: month - 1,
          year
        }
      })

      const stockRaw: StockInvestor[] = dataJson.map((stock) => ({
        ...stock,
        infoId: newInfo.id
      }))

      const seenTickers = new Set<string>()
      const tickerName: TickerName[] = []

      for (const { ticker, name } of stockRaw) {
        if (!seenTickers.has(ticker)) {
          seenTickers.add(ticker)
          tickerName.push({ ticker, name })
        }
      }

      await tx.stock.createMany({
        data: tickerName,
        skipDuplicates: true,
      })

      const stock: Stock[] = stockRaw.map(({
        infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
      }) => ({
        infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
      }))

      const chunk = 1000
      for (let i = 0; i < stock.length; i += chunk) {
        await tx.stockInvestor.createMany({
          data: stock.slice(i, i + chunk),
          skipDuplicates: true
        })
      }
    }, {
      timeout: 1000 * 60
    })

    return { message: 'Created' }
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: error.message
      }
    }
  }
})