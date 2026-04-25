import { CacheItem } from "../types"

const cache = useStorage()

const ONE_DAY = 24 * 60 * 60 * 1000

export const setCache = async <T>(key: string, value: T): Promise<void> => {
  const finalValue: CacheItem<T> = {
    value,
    expiresOn: Date.now() + ONE_DAY
  }

  await cache.setItem(key, finalValue)
}

export const getCache = async <T>(key: string): Promise<T | null> => {
  const item = await cache.getItem<CacheItem<T>>(key)

  if (!item) return null

  if (Date.now() > item.expiresOn) {
    await cache.removeItem(key)
    return null
  }

  return item.value
}