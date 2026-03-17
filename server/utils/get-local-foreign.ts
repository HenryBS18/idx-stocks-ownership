import { localForeignString } from "./constants"

export const getLocalForeign = (type?: string): string => {
  if (!type) return ''
  return localForeignString[type] ?? ''
}