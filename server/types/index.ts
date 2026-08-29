import { Browser, Page } from "puppeteer"

export type BrowserPage = {
  browser: Browser
  page: Page
}

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
  localForeign: string
  domicile: string
  totalHoldingShare: bigint
  percentage: unknown
}

export type TeaserStock = {
  ticker: string
  name: string
  stockInvestor: TeaserInvestorRow[]
}

export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]