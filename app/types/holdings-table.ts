import type { ControllerOrAffiliate } from '~~/shared/types'

type HoldingTableRow = {
  controllerOrAffiliate: ControllerOrAffiliate | null
  totalHoldingShare: string | number
  percentage: number
  change: number | null
  hasPrevData: boolean
}

export type StockInvestorTableRow = HoldingTableRow & {
  investorName: string
  investorSlug?: string | null
  investorType: string
  localForeign: string
  domicile: string
}

export type InvestorStockTableRow = HoldingTableRow & {
  ticker: string
  name: string
  sector: string | null
}
