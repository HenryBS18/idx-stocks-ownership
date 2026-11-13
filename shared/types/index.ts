export type ControllerOrAffiliate = 'CONTROLLER' | 'AFFILIATE'

export type StockDetail = {
  ticker: string
  name: string
  sector: string | null
  investorCount: number
  float: number
  freeFloat: number
  hscConcentration: number | null
  investors: {
    investorType: string
    controllerOrAffiliate: ControllerOrAffiliate | null
    localForeign: string
    totalHoldingShare: number
    percentage: number
    investorName: string
    investorSlug?: string | null
    domicile: string
    change: number | null
    hasPrevData: boolean
  }[]
}

export type InvestorPortfolio = {
  investorName: string
  investorSlug?: string | null
  investorType: string
  localForeign: string
  domicile: string
  stockCount: number
  stocks: {
    ticker: string
    controllerOrAffiliate: ControllerOrAffiliate | null
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

export type HscStock = {
  ticker: string
  name: string
  sector: string | null
  hscConcentration: number
}
