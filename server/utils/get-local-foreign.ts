import { localForeignLabels } from "./constants"

export const getLocalForeign = (originCode?: string): string => {
  if (!originCode) return ''
  return localForeignLabels[originCode] ?? ''
}