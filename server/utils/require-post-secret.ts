import { createHash, timingSafeEqual } from 'node:crypto'

const digest = (value: string): Buffer => createHash('sha256').update(value).digest()

export const requirePostSecret = (event: any): void => {
  const secret = process.env.POST_SECRET

  if (!secret) throw createError({ statusCode: 503, statusMessage: 'Service Unavailable: POST_SECRET belum diatur.' })

  const provided = getHeader(event, 'x-post-secret')

  if (!provided || !timingSafeEqual(digest(provided), digest(secret))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Secret tidak valid.' })
  }
}
