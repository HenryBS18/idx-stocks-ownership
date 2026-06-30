import csvParser from 'csv-parser'
import fs from 'fs'
import type { InvestorHolding } from '../types'

const toNum = (v: string) => Number(String(v).replace(/,/g, '')) || 0

export const parseCsv = async (filePath: string): Promise<InvestorHolding[]> => {
  const results: InvestorHolding[] = []

  const stream = fs.createReadStream(filePath).pipe(csvParser())

  for await (const row of stream) {
    results.push({
      ticker: row.SHARE_CODE || '',
      name: row.ISSUER_NAME || '',
      investorName: row.INVESTOR_NAME || '',
      investorType: row.INVESTOR_CLASSIFICATION || '',
      localForeign: row.LOCAL_FOREIGN || '',
      domicile: row.DOMICILE || '',
      scripless: toNum(row.HOLDINGS_SCRIPLESS),
      scrip: toNum(row.HOLDINGS_SCRIP),
      totalHoldingShare: toNum(row.TOTAL_HOLDING_SHARES),
      percentage: toNum(row.PERCENTAGE),
    })
  }

  return results
}