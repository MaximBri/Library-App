import jwt, { SignOptions } from 'jsonwebtoken'

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error(
    'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in .env'
  )
}

export const ACCESS_EXPIRES = Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || 43200
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh'
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || '30')

export function generateAccessToken(payload: { userId: number; role: string }) {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES }
  return jwt.sign(payload as string | object | Buffer, ACCESS_SECRET, options)
}

export function generateRefreshToken(payload: { userId: number }) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + REFRESH_DAYS)
  const token = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: `${REFRESH_DAYS}d`,
  })
  return { token, expiresAt }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_SECRET) as {
      userId: number
      iat: number
      exp: number
    }
  } catch (e) {
    throw { status: 401, message: 'Invalid refresh token' }
  }
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET) as {
      userId: number
      role: string
      iat: number
      exp: number
    }
  } catch (e) {
    throw null
  }
}
