import csvParser from 'csv-parser'
import fs from 'fs'
import type { InvestorHolding } from '../types'

const toNum = (v: string) => Number(String(v).replace(/,/g, '')) || 0

const toControllerOrAffiliate = (value: string | undefined): InvestorHolding['controllerOrAffiliate'] => {
  switch (value?.trim().toUpperCase()) {
    case 'CONTROLLER': return 'CONTROLLER'
    case 'AFFILIATE OF THE CONTROLLER': return 'AFFILIATE'
    default: return null
  }
}

export const parseCsv = async (filePath: string): Promise<InvestorHolding[]> => {
  const results: InvestorHolding[] = []

  const stream = fs.createReadStream(filePath).pipe(csvParser())

  for await (const row of stream) {
    results.push({
      ticker: row.SHARE_CODE || '',
      name: row.ISSUER_NAME || '',
      investorName: row.INVESTOR_NAME || '',
      investorType: row.INVESTOR_CLASSIFICATION || '',
      controllerOrAffiliate: toControllerOrAffiliate(row.CONTROLLER_OR_AFFILIATE),
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
