import { promises as dns } from 'node:dns'

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'production') return

  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/')) return

  const ua = getHeader(event, 'user-agent')
  if (!ua) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const uaLower = ua.toLowerCase()

  const isGooglebot = uaLower.includes('googlebot')
  if (isGooglebot) {
    const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0] ?? ''
    try {
      const host = await dns.reverse(ip)
      if (host.some((h: string) => h.endsWith('.googlebot.com') || h.endsWith('.google.com'))) return
    } catch {}
  }

  if (!isGooglebot && !/(Chrome|Firefox|Safari|Edge|Edg|OPR|Brave)\//i.test(ua)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const limits: Record<string, number> = {
    '/api/info': 10,
    '/api/stock': 20,
    '/api/investor': 20,
    '/api/token': 5,
  }
  const limit = Object.entries(limits).find(([p]) => path.startsWith(p))?.[1] ?? 60
  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const storage = useStorage('redis')
  const key = `ratelimit:${path.split('/').slice(0, 3).join('/')}:${ip}`

  const count = (await storage.getItem<number>(key)) ?? 0
  if (count >= limit) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  await storage.setItem(key, count + 1, { ttl: 60 })
})
