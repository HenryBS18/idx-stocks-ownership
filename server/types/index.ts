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

export type TickerName = Pick<StockInvestor, 'ticker' | 'name'>

export type InvestorStock = {
  investorName: string
  stocks: Pick<StockInvestor, 'ticker' | 'name' | 'totalHoldingShare' | 'percentage'>[]
}