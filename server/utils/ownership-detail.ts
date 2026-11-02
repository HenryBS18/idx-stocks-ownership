import type { DetailHolding } from '../../shared/types/detail.ts'

export type DetailRecord = Omit<DetailHolding, 'totalHoldingShare' | 'previousPercentage' | 'change' | 'changeKind'> & {
  totalHoldingShare: string | bigint
}

const round = (value: number) => Math.round(value * 100) / 100
const key = (row: DetailRecord) => JSON.stringify([row.ticker, row.investorName])

export const aggregateHoldings = (records: DetailRecord[]): DetailRecord[] => {
  const grouped = new Map<string, DetailRecord>()
  for (const record of records) {
    const previous = grouped.get(key(record))
    grouped.set(key(record), previous ? {
      ...previous,
      percentage: round(previous.percentage + record.percentage),
      totalHoldingShare: (BigInt(previous.totalHoldingShare) + BigInt(record.totalHoldingShare)).toString(),
    } : { ...record, totalHoldingShare: record.totalHoldingShare.toString() })
  }
  return [...grouped.values()]
}

export const compareHoldings = (current: DetailRecord[], previous: DetailRecord[] | null) => {
  const currentRows = aggregateHoldings(current)
  const previousRows = aggregateHoldings(previous ?? [])
  const previousMap = new Map(previousRows.map(row => [key(row), row]))
  const currentKeys = new Set(currentRows.map(key))
  const holdings: DetailHolding[] = currentRows.map(row => {
    const before = previousMap.get(key(row))
    const change = before ? round(row.percentage - before.percentage) : null
    return {
      ...row,
      totalHoldingShare: row.totalHoldingShare.toString(),
      previousPercentage: before?.percentage ?? null,
      change,
      changeKind: previous === null ? 'unavailable' : !before ? 'new'
        : change! > 0 ? 'increased' : change! < 0 ? 'decreased' : 'unchanged',
    }
  })
  const removedHoldings: DetailHolding[] = previousRows.filter(row => !currentKeys.has(key(row))).map(row => ({
    ...row,
    totalHoldingShare: row.totalHoldingShare.toString(),
    previousPercentage: row.percentage,
    change: null,
    changeKind: 'removed',
  }))
  return { holdings, removedHoldings }
}
