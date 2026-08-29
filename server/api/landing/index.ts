import { LandingService } from "~~/server/services/landing.service"

const landingService = new LandingService()

export default defineEventHandler(async (event) => {
  try {
    return await landingService.getTeaser()
  } catch (error) {
    setResponseStatus(event, 500)

    return {
      message: error instanceof Error ? error.message : 'Gagal memuat data'
    }
  }
})
