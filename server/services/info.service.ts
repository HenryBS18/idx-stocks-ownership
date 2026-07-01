export class InfoService {
  async getInfoLabels(): Promise<InfoResponse> {
    const cached = await getCache<InfoResponse>('infos')
    if (cached) return cached

    const result: InfoResponse = (await prisma.info.findMany({
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

    await setCache<InfoResponse>('infos', result)

    return result
  }
}