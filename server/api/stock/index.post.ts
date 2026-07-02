import { StockService } from "~~/server/services/stock.service"
import { invalidateCache } from "~~/server/utils/cache"
import { parseDateTime } from "~~/server/utils/parse-date-time"

const stockService = new StockService()

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
      return { message: 'idxLastUpdated not valid' }
    }

    const { month, year } = parseDateTime(idxLastUpdated)

    const info = await prisma.info.findFirst({
      where: { month: month - 1, year }
    })

    if (info) {
      return { message: 'Already Updated to the Latest Data' }
    }

    await stockService.insertStock({ fileBuffer: filePart!.data, idxLastUpdated })

    await invalidateCache('infos')

    return { message: 'Created' }
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: error.message
      }
    }
  }
})