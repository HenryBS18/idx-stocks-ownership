export const requireAuth = (event: any): void => {
  const token = getQuery(event).token?.toString()
  if (!verifyToken(token)) throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Token tidak valid.' })
}
