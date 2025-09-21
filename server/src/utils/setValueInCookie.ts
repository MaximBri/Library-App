import { Response } from 'express'
import { COOKIE_SECURE } from '../constants'

export function setValueInCookie(
  res: Response,
  token: string,
  cookieName: string,
  path: string,
  maxAge: number
) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: 'lax',
    path,
    maxAge,
  })
}
