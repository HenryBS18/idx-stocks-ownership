export default defineEventHandler(async (event) => {
  try {
    const token = getQuery(event).token?.toString()

    const tokenVerified = verifyToken(token)

    if (!tokenVerified) {
      setResponseStatus(event, 401)

      return { message: 'Unauthorized: Token tidak valid.' }
    }

    const cachedInfos = await getCache('infos')
    if (cachedInfos) return cachedInfos

    const infos = (await prisma.info.findMany({
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ],
    },
    )).map((info, i) => {
      const dateString = getLastDate(info.month, info.year)
      const label = `${dateString}${i === 0 ? ' (Terbaru)' : ''}`
      const value = `${info.year}-${info.month}`

      return { label, value }
    })

    await setCache('infos', infos)

    return infos
  } catch (error) {
    if (error instanceof Error) {
      setResponseStatus(event, 500)

      return {
        message: error.message
      }
    }
  }
})