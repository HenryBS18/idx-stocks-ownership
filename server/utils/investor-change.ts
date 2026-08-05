export const round2 = (n: number): number => Math.round(n * 100) / 100

export const investorKey = (ticker: string, investorName: string): string => `${ticker}|${investorName}`

export async function getPrevMap(info: { year: number; month: number },): Promise<Map<string, number> | null> {
  const prevInfo = await prisma.info.findFirst({
    where: {
      OR: [
        { year: info.year, month: { lt: info.month } },
        { year: { lt: info.year } },
      ],
    },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  })

  if (!prevInfo) return null

  const prevHoldings = await prisma.stockInvestor.findMany({
    where: { infoId: prevInfo.id },
    select: { ticker: true, investorName: true, percentage: true },
  })

  return new Map(
    prevHoldings.map((h) => [
      investorKey(h.ticker, h.investorName),
      parseFloat(h.percentage.toString()),
    ]),
  )
}
