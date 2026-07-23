import { localForeignLabels } from "./constants"

export const getLocalForeign = (originCode?: string): string => {
  if (!originCode) return ''
  return localForeignLabels[originCode] ?? ''
}

export const getOrigin = (code: string | null, domicile: string | null): string => {
  const origin = getLocalForeign(code ?? undefined)
  return domicile ? `${origin} (${domicile})` : origin
}