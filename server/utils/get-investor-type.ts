import { investorTypeLabels } from "./constants"

export const getInvestorType = (typeCode?: string): string => {
  if (!typeCode) return ''
  return investorTypeLabels[typeCode] ?? ''
}