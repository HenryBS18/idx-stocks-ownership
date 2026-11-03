import type { DetailHolding } from '../../shared/types/detail.ts'

export type DetailRecord = Omit<DetailHolding, 'totalHoldingShare' | 'previousPercentage' | 'change' | 'changeKind'> & {
  totalHoldingShare: string | bigint
}

const round = (value: number) => Math.round(value * 100) / 100
const key = (row: DetailRecord) => JSON.stringify([row.ticker, row.investorName])

export const aggregateHoldings = (records: DetailRecord[]): DetailRecord[] => {
  const grouped = new Map<string, {
    holding: DetailRecord
    classifications: Set<NonNullable<DetailRecord['controllerOrAffiliate']>>
  }>()
  for (const record of records) {
    const recordKey = key(record)
    let group = grouped.get(recordKey)
    if (group) {
      group.holding.percentage = round(group.holding.percentage + record.percentage)
      group.holding.totalHoldingShare = (BigInt(group.holding.totalHoldingShare) + BigInt(record.totalHoldingShare)).toString()
    } else {
      group = {
        holding: { ...record, totalHoldingShare: record.totalHoldingShare.toString() },
        classifications: new Set(),
      }
      grouped.set(recordKey, group)
    }
    if (record.controllerOrAffiliate !== null) group.classifications.add(record.controllerOrAffiliate)
  }
  return [...grouped.values()].map(({ holding, classifications }) => ({
    ...holding,
    controllerOrAffiliate: classifications.size === 1 ? [...classifications][0]! : null,
  }))
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
