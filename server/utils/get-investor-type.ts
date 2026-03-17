import { investorTypeString } from "./constants"

export const getInvestorType = (type?: string): string => {
  if (!type) return ''
  return investorTypeString[type] ?? ''
}