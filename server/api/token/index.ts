
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')

  if (!token) {
    const newToken = signToken()

    setCookie(event, 'token', newToken, {
      maxAge: 60 * 60 * 24 * 1
    })

    return
  }

  const tokenVerified = verifyToken(token)

  if (!tokenVerified) {
    const newToken = signToken()

    setCookie(event, 'token', newToken, {
      maxAge: 60 * 60 * 24 * 1
    })

    return
  }

  return
})