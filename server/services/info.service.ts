import { InfoLabels } from "../types"

export class InfoService {
  async getInfoLabels(): Promise<InfoLabels> {
    const cachedInfoLabels = await getCache<InfoLabels>('infos')
    if (cachedInfoLabels) return cachedInfoLabels

    const infoLabels: InfoLabels = (await prisma.info.findMany({
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

    await setCache('infos', infoLabels)

    return infoLabels
  }
}