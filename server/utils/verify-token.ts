import jwt from 'jsonwebtoken'

export const verifyToken = (token: string | undefined): boolean => {
  try {
    if (!token) return false

    const secret = process.env.JWT_SECRET!

    jwt.verify(token, secret, { algorithms: ['HS256'] })

    return true
  } catch (error) {
    return false
  }
}