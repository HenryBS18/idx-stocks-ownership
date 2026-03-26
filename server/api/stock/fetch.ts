// import fs from 'fs'
// // @ts-ignore
// import extractor from 'pdf-table-extractor'
// import { IdxFileData, Stock, StockInvestor, TickerName } from "~~/server/types"
// import { datetimeParser } from "~~/server/utils/datetime-parser"

// export default defineEventHandler(async (event) => {
//   console.time()

//   const { browser, page } = await browserPage()

//   try {
//     const idxUrl = 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi'

//     await page.goto(idxUrl, { waitUntil: "domcontentloaded" })

//     await page.waitForSelector('#FilterSearch', { timeout: 5000 })
//     await page.type('#FilterSearch', '1%')

//     await page.waitForNetworkIdle({ timeout: 5000 })

//     const TARGET_TITLE = "Pemegang Saham di atas 1% (KSEI)"

//     const data: IdxFileData | null = await page.$$eval("div.attach-card", (cards, TARGET_TITLE) => {
//       for (const card of cards) {
//         const titleA = card.querySelector("h6.title a")
//         if (!titleA) continue

//         const titleText = titleA.textContent.trim()

//         if (titleText.includes(TARGET_TITLE)) {
//           const timeEl = card.querySelector("time")
//           const attachment = card.querySelector("ul.list-nostyle a[href]")

//           return {
//             time: timeEl ? timeEl.textContent.replace(/\n\t\t/g, ' ').trim() : null,
//             url: attachment ? attachment.href : null
//           }
//         }
//       }

//       return null
//     }, TARGET_TITLE)

//     const { url, time } = data!
//     const info = await prisma.info.findFirst({
//       where: {
//         idxLastUpdated: time
//       }
//     })

//     if (info) {
//       return { message: 'Already Updated to the Latest Data' }
//     }

//     const { month, year } = datetimeParser(time)

//     const newInfo = await prisma.info.create({
//       data: {
//         idxLastUpdated: time,
//         month: month - 1,
//         year
//       }
//     })

//     await operate(url, newInfo.id)

//     return { message: 'Created' }
//   } catch (error) {
//     if (error instanceof Error) {
//       setResponseStatus(event, 500)

//       return {
//         message: error.message
//       }
//     }
//   } finally {
//     await browser.close()
//     console.timeEnd()
//   }
// })

// const operate = async (url: string, infoId: number) => {
//   const { browser, page } = await browserPage()

//   await page.goto(url, { waitUntil: "networkidle2" })

//   const buffer = await page.evaluate(async (url) => {
//     const res = await fetch(url)
//     const arrayBuffer = await res.arrayBuffer()
//     return Array.from(new Uint8Array(arrayBuffer))
//   }, url)

//   await browser.close()

//   const pdfBuffer = Buffer.from(buffer)

//   const dir = 'tmp'
//   const filename = `${crypto.randomUUID()}.pdf`
//   const path = `${dir}/${filename}`

//   await fs.promises.mkdir("tmp", { recursive: true })

//   await fs.promises.writeFile(path, pdfBuffer)

//   try {
//     const stockRaw: StockInvestor[] = await new Promise((resolve, reject) => {
//       extractor(path, (result: any) => {
//         try {
//           const pageTables = result.pageTables
//           const data = []

//           for (const page of pageTables) {
//             for (const table of page.tables) {
//               if (table[0] === "DATE") continue

//               data.push({
//                 infoId: infoId,
//                 ticker: table[1],
//                 name: table[2],
//                 investorName: table[3],
//                 investorType: table[4] ?? "",
//                 localForeign: table[5].trim(),
//                 domicile: table[7] ?? "",
//                 scripless: parseInt(table[8].replace(/\./g, ""), 10),
//                 scrip: parseInt(table[9].replace(/\./g, ""), 10),
//                 totalHoldingShare: parseInt(table[10].replace(/\./g, ""), 10),
//                 percentage: parseFloat(table[11].replace(",", "."))
//               })
//             }
//           }

//           resolve(data)
//         } catch (err) {
//           reject(err)
//         }
//       })
//     })

//     const seenTickers = new Set<string>()
//     const tickerName: TickerName[] = []

//     for (const { ticker, name } of stockRaw) {
//       if (!seenTickers.has(ticker)) {
//         seenTickers.add(ticker)
//         tickerName.push({ ticker, name })
//       }
//     }

//     await prisma.stock.createMany({
//       data: tickerName,
//       skipDuplicates: true,
//     })

//     const stock: Stock[] = stockRaw.map(({
//       infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
//     }) => ({
//       infoId, ticker, investorName, investorType, localForeign, domicile, scripless, scrip, totalHoldingShare, percentage
//     }))

//     const chunk = 1000
//     for (let i = 0; i < stock.length; i += chunk) {
//       await prisma.stockInvestor.createMany({
//         data: stock.slice(i, i + chunk),
//         skipDuplicates: true
//       })
//     }

//   } finally {
//     await fs.promises.rm(path, { recursive: true, force: true })
//     await browser.close()
//   }
// } 
