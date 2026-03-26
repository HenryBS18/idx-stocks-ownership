// import puppeteer from "puppeteer"
// import { BrowserPage } from "../types"

// export const browserPage = async (): Promise<BrowserPage> => {
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: [
//       "--disable-blink-features=AutomationControlled",
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//       "--disable-gpu",
//       "--disable-infobars",
//       "--window-size=1280,800"
//     ]
//   })

//   const page = await browser.newPage()

//   await page.setExtraHTTPHeaders({
//     'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
//   })

//   await page.setViewport({
//     width: 1280,
//     height: 800,
//     deviceScaleFactor: 1,
//     isMobile: false,
//     hasTouch: false
//   })

//   await page.emulateTimezone("Asia/Jakarta")

//   await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, "webdriver", {
//       get: () => undefined
//     })
//   })

//   return { browser, page }
// }