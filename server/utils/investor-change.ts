export const round2 = (n: number): number => Math.round(n * 100) / 100

export const investorKey = (ticker: string, investorName: string): string =>
  `${ticker}|${investorName}`