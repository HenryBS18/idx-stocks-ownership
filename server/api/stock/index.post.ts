import { StockService } from "~~/server/services/stock.service"

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
      return { message: 'idxLastUpated not valid' }
    }

    const info = await prisma.info.findFirst({
      where: { idxLastUpdated }
    })

    if (info) {
      return { message: 'Already Updated to the Latest Data' }
    }

    await stockService.insertStock({
      fileBuffer: filePart?.data,
      idxLastUpdated
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