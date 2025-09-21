import { Request, Response } from 'express'
import * as authService from '../services/auth.service'
import { RegisterInput, LoginInput } from '../validators/auth.validator'
import { ACCESS_EXPIRES } from '../utils/jwt'
import { setValueInCookie } from '../utils/setValueInCookie'
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRES_IN_DAYS,
} from '../constants'

const setTokens = (res: Response, refresh: string, access?: string) => {
  if (access) {
    setValueInCookie(res, access, ACCESS_TOKEN, '/', ACCESS_EXPIRES)
  }
  setValueInCookie(
    res,
    refresh,
    REFRESH_TOKEN,
    '/api/auth/refresh',
    1000 * 60 * 60 * 24 * REFRESH_TOKEN_EXPIRES_IN_DAYS
  )
}

export const register = async (req: Request, res: Response) => {
  const data = RegisterInput.parse(req.body)
  await authService.register(data)

  const { accessToken, refreshToken } = await authService.login({
    email: data.email,
    password: data.password,
  })

  setTokens(res, refreshToken.token, accessToken)

  res.status(201).json({ success: 'true' })
}

export const login = async (req: Request, res: Response) => {
  const data = LoginInput.parse(req.body)
  const { accessToken, refreshToken } = await authService.login(data)

  setTokens(res, refreshToken.token, accessToken)

  res.json({ success: 'true' })
}

export const refresh = async (req: Request, res: Response) => {
  const tokenFromCookie = req.cookies?.refreshToken
  if (!tokenFromCookie)
    return res.status(401).json({ message: 'No refresh token' })

  const { refreshToken } = await authService.refresh(tokenFromCookie)

  setTokens(res, refreshToken.token)

  res.json({ success: 'true' })
}

export const logout = async (req: Request, res: Response) => {
  const tokenFromCookie = req.cookies?.refreshToken
  if (tokenFromCookie) {
    await authService.logout(tokenFromCookie)
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' })
  }
  res.status(204).send()
}

export const me = async (req: Request, res: Response) => {
  const user = await authService.findUserById((req as any).userId)
  res.json({
    id: user?.id,
    email: user?.email,
    role: user?.role,
    name: user?.name ?? null,
    surname: user?.surname ?? null,
  })
}
