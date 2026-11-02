export type DetailPeriod = {
  value: string
  label: string
  idxLastUpdated: string
  createdAt: string
}

export type HoldingChange = 'increased' | 'decreased' | 'unchanged' | 'new' | 'removed' | 'unavailable'

export type DetailHolding = {
  ticker: string
  stockName: string
  sector: string | null
  investorName: string
  investorSlug: string | null
  investorType: string
  localForeign: string
  domicile: string
  totalHoldingShare: string
  percentage: number
  previousPercentage: number | null
  change: number | null
  changeKind: HoldingChange
}

export type OwnershipDetail = {
  kind: 'stock' | 'investor'
  identity: {
    name: string
    ticker: string | null
    slug: string | null
    sector: string | null
    investorType: string | null
    localForeign: string | null
    domicile: string | null
  }
  period: DetailPeriod
  previousPeriod: DetailPeriod | null
  latestAvailablePeriod: DetailPeriod | null
  holdings: DetailHolding[]
  removedHoldings: DetailHolding[]
  recordedOwnership: number | null
  freeFloat: number | null
}
