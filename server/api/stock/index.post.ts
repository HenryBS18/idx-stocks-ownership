import fs from "fs"
import path from "path"
import { Stock, StockRaw, TickerName } from "~~/server/types"
export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData) return {
    message: 'Formdata is required'
  }

  let idxLastUpdated = ''
  let filePath = ''

  try {
    for (const part of formData) {
      if (part.name === 'idxLastUpdated') {
        idxLastUpdated = part.data.toString()
      }

      if (part.name === 'file') {
        filePath = path.join(process.cwd(), 'tmp', `${crypto.randomUUID()}.json`)
        await fs.promises.writeFile(filePath, part.data)
      }
    }

    const file = Bun.file(filePath)
    const dataJson = await file.json() as StockRaw[]
    console.log(idxLastUpdated)
    console.log(dataJson)

    const info = await prisma.info.findFirst({
      where: { idxLastUpdated }
    })

    if (info) {
      return { message: 'Already Updated to the Latest Data' }
    }

    const { month, year } = datetimeParser(idxLastUpdated)

    await prisma.$transaction(async (tx) => {
      console.log('creating info')
      const newInfo = await tx.info.create({
        data: {
          idxLastUpdated,
          month: month - 1,
          year
        }
      })

      const stockRaw: StockRaw[] = dataJson.map((stock) => ({
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

      console.log('creating ticker name')
      await tx.stock.createMany({
        data: tickerName,
        skipDuplicates: true,
      })

      const stock: Stock[] = stockRaw.map(({
        infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
      }) => ({
        infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
      }))

      console.log('creating stock investor')
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

    console.log('process completed')

    return { message: 'Created' }
  } catch (error) {
    return error
  } finally {
    await Bun.file(filePath).delete()
  }
})  