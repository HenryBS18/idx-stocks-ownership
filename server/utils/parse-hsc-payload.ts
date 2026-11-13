export type HscPayloadItem = { ticker: string; concentration: number | null }

export type HscPayload = { announceAt: Date; data: HscPayloadItem[] }

const MAX_ITEMS = 2000
const MAX_CONCENTRATION = 99.999
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const badRequest = (message: string) => Object.assign(new Error(message), { statusCode: 400, statusMessage: message })

const parseAnnounceAt = (value: unknown): Date => {
  const match = typeof value === 'string' ? DATE_PATTERN.exec(value.trim()) : null
  if (!match) throw badRequest('announceAt wajib berformat YYYY-MM-DD.')

  const [, year, month, day] = match.map(Number)
  const date = new Date(Date.UTC(year!, month! - 1, day!))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month! - 1 || date.getUTCDate() !== day) {
    throw badRequest('announceAt bukan tanggal yang valid.')
  }

  return date
}

const parseItem = (item: unknown, index: number): HscPayloadItem => {
  if (!item || typeof item !== 'object') throw badRequest(`data[${index}] harus berupa object { ticker, concentration }.`)

  const { ticker, concentration } = item as Record<string, unknown>

  if (typeof ticker !== 'string' || ticker.trim().length !== 4) {
    throw badRequest(`data[${index}].ticker harus 4 karakter.`)
  }

  if (concentration !== null) {
    if (typeof concentration !== 'number' || !Number.isFinite(concentration) || concentration < 0 || concentration > MAX_CONCENTRATION) {
      throw badRequest(`data[${index}].concentration harus angka 0 sampai ${MAX_CONCENTRATION}, atau null.`)
    }
  }

  return { ticker: ticker.trim().toUpperCase(), concentration }
}

export const parseHscPayload = (body: unknown): HscPayload => {
  if (!body || typeof body !== 'object') throw badRequest('Body wajib berupa JSON { announceAt, data }.')

  const { announceAt, data } = body as Record<string, unknown>

  if (!Array.isArray(data) || data.length === 0) throw badRequest('data wajib berupa array yang tidak kosong.')
  if (data.length > MAX_ITEMS) throw badRequest(`data maksimal ${MAX_ITEMS} item.`)

  const items = data.map(parseItem)
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const { ticker } of items) {
    if (seen.has(ticker)) duplicates.add(ticker)
    seen.add(ticker)
  }

  if (duplicates.size) throw badRequest(`Ticker duplikat: ${[...duplicates].join(', ')}`)

  return { announceAt: parseAnnounceAt(announceAt), data: items }
}
