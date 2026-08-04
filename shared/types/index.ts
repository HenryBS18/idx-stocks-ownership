export type StockDetail = {
  ticker: string
  name: string
  investorCount: number
  float: number
  freeFloat: number
  investors: {
    investorType: string
    localForeign: string
    totalHoldingShare: number
    percentage: number
    investorName: string
    domicile: string
    origin: string
    change: number | null   // delta vs previous month; null = no prev-month holding for this investor
    hasPrevData: boolean    // true when a previous-month batch exists in the DB (batch-level, carried per-row)
  }[]
}

export type InvestorPortfolio = {
  investorName: string
  investorType: string
  localForeign: string
  domicile: string
  stockCount: number
  stocks: {
    ticker: string
    name: string
    totalHoldingShare: number
    percentage: number
  }[]
}

export type Info = {
  label: string
  value: string
}

export type InfoResponse = Info[]
