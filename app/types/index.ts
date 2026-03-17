type Investor = {
  investorName: string
  investorType: string
  localForeign: string
  domicile: string
  totalHoldingShare: number
  percentage: number
}

export type Stock = {
  ticker: string
  name: string
  investorCount: number
  freeFloat: number
  investors: Investor[]
}

export type StockResponse = {
  lastUpdated: string
  data: Stock[]
}

export type InvestorStock = {
  investorName: string
  investorType: string
  localForeign: string
  stockCount: number
  stocks: {
    ticker: string
    name: string
    totalHoldingShare: number
    percentage: number
  }[]
}

export type InvestorStockResponse = {
  lastUpdated: string
  data: InvestorStock[]
}