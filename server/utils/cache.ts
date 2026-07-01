const cache = useStorage('redis')

const FIVE_DAYS = 5 * 24 * 60 * 60

export const setCache = <T>(key: string, value: T): Promise<void> => {
  return cache.setItem(key, value as any, { ttl: FIVE_DAYS })
}

export const getCache = <T>(key: string): Promise<T | null> => {
  return cache.getItem<T>(key)
}

export const invalidateCache = async (key: string): Promise<void> => {
  await cache.removeItem(key)
}
