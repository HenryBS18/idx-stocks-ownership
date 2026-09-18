import sectorMap from "../data/sector.json"

const map = sectorMap as Record<string, string>

export function getSectorByTicker(ticker: string | undefined): string | null {
  if (!ticker) return null
  const sector = map[ticker.trim().toUpperCase()]
  return sector ? sector.trim() : null
}
