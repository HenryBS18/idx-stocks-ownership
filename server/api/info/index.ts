import { InfoService } from "~~/server/services/info.service"

const infoService = new InfoService()

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)

    return await infoService.getDateOptions()
  } catch (error: any) {
    setResponseStatus(event, error.statusCode)
    return { message: error.message }
  }
})
