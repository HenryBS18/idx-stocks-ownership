import type { ControllerOrAffiliate } from '../../shared/types'

export type IdxFileData = {
  time: string
  url: string
}

export type StockHolding = {
  infoId: number
  ticker: string
  name: string
  investorName: string
  investorType: string
  controllerOrAffiliate: ControllerOrAffiliate | null
  localForeign: string
  domicile: string
  scripless: number
  scrip: number
  totalHoldingShare: number
  percentage: number
}

export type HoldingRecord = Omit<StockHolding, 'name'>

export type InvestorHolding = Omit<StockHolding, 'infoId'>

export type TickerName = Pick<StockHolding, 'ticker' | 'name'>

export type GetStockParam = {
  year: number
  month: number
}

export type InsertStockParam = {
  fileBuffer: Buffer
  idxLastUpdated: string
}

export type GetInvestorParam = GetStockParam

export type InfoPeriod = {
  year: number
  month: number
}

export type InfoBatch = InfoPeriod & {
  id: number
}

export type TeaserInvestorRow = {
  investorName: string
  investorType: string
  controllerOrAffiliate: ControllerOrAffiliate | null
  localForeign: string
  domicile: string
  totalHoldingShare: bigint
  percentage: unknown
}

export type TeaserStock = {
  ticker: string
  name: string
  hscConcentration: unknown
  stockInvestor: TeaserInvestorRow[]
}

export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

export type SitemapContentDates = {
  pages: Record<string, string | null>
  stocks: string | null
  investors: string | null
}

export type SitemapName = 'sitemap-pages' | 'sitemap-stocks' | 'sitemap-investors'
