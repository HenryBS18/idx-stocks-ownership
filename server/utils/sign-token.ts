import jwt from 'jsonwebtoken'

export const signToken = (): string => {
  const secret = process.env.JWT_SECRET!

  const payload = {
    sub: crypto.randomUUID()
  }

  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '1d'
  })
}