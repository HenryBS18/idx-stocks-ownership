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