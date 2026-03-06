import { Browser, Page } from "puppeteer"

export type BrowserPage = {
  browser: Browser
  page: Page
}