export type StockDetail = {
  ticker: string
  name: string
  sector: string | null
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
    change: number | null
    hasPrevData: boolean
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
    sector: string | null
    totalHoldingShare: number
    percentage: number
    change: number | null
    hasPrevData: boolean
  }[]
}

export type DataCoverage = {
  start: string
  end: string
}

export type LandingTeaser = {
  batchLabel: string
  emitenCount: number
  coverage: DataCoverage | null
  stock: StockDetail | null
}

export type Info = {
  label: string
  value: string
}

export type InfoResponse = Info[]
