import { investorTypeLabels } from "./constants"

export const getInvestorType = (rawType?: string): string => {
  if (!rawType) return ''
  return investorTypeLabels[rawType] ?? rawType
}