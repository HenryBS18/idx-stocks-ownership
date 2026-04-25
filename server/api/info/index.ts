import { InfoService } from "~~/server/services/info.service"

const infoService = new InfoService()

export default defineEventHandler(async (event) => {
  try {
    const token = getQuery(event).token?.toString()

    const tokenVerified = verifyToken(token)

    if (!tokenVerified) {
      setResponseStatus(event, 401)

      return { message: 'Unauthorized: Token tidak valid.' }
    }

    const infoLabels = await infoService.getInfoLabels()

    return infoLabels
  } catch (error) {
    if (error instanceof Error) {
      setResponseStatus(event, 500)

      return {
        message: error.message
      }
    }
  }
})