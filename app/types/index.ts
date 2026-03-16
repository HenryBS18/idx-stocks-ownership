type Investor = {
  investorName: string
  investorType: string
  localForeign: string
  domicile: string
  totalHoldingShare: string
  percentage: string
}

export type Stock = {
  ticker: string
  name: string
  freeFloat: number
  investors: Investor[]
}

export type StockResponse = {
  lastUpdated: string
  data: Stock[]
}