import { Browser, Page } from "puppeteer"

export type BrowserPage = {
  browser: Browser
  page: Page
}

export type IdxFileData = {
  time: string
  url: string
}

export type StockInvestor = {
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

export type Stock = Omit<StockInvestor, 'name'>

export type StockInvestors = {
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
  }[]
}[]

export type TickerName = Pick<StockInvestor, 'ticker' | 'name'>

export type InvestorStock = {
  investorName: string
  investorType?: string
  localForeign?: string
  domicile: string
  stockCount: number
  stocks: Pick<StockInvestor, 'ticker' | 'name' | 'totalHoldingShare' | 'percentage'>[]
}

export type CacheItem<T> = {
  value: T
  expiresOn: number
}

export type GetStockParam = {
  year: number
  month: number
}

export type InsertStockParam = {
  fileBuffer: Buffer<ArrayBufferLike>
  idxLastUpdated: string
}

export type GetInvestorParam = GetStockParam

export type InfoLabels = {
  label: string
  value: string
}[]