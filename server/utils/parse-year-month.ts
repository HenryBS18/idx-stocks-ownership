export const parseYearMonth = async (event: any): Promise<{ year: number; month: number }> => {
  const { year, month } = getQuery(event)

  if (!year && !month) {
    const latest = await prisma.info.findFirst({
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    })
    if (!latest) throw createError({ statusCode: 404, statusMessage: 'Data tidak tersedia' })
    return { year: latest.year, month: latest.month }
  }

  const y = parseInt(year!.toString(), 10)
  const m = parseInt(month!.toString(), 10)

  if (isNaN(y) || isNaN(m)) throw createError({ statusCode: 400, statusMessage: 'Year dan month harus berupa angka' })
  if (m < 1 || m > 12) throw createError({ statusCode: 400, statusMessage: 'Month harus antara 1 - 12' })

  return { year: y, month: m }
}
