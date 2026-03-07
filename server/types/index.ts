import { Browser, Page } from "puppeteer"

export type BrowserPage = {
  browser: Browser
  page: Page
}

export type IdxFileData = {
  time: string
  url: string
}

export type StockRaw = {
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

export type Stock = Omit<StockRaw, 'name'>

export type TickerName = Pick<StockRaw, 'ticker' | 'name'>