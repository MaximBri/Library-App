import { Request, Response } from 'express'
import * as authService from '../services/auth.service'
import { RegisterInput, LoginInput, UpdateProfileInput, UpdateRoleInput } from '../validators/auth.validator'
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
    '/',
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

  const { accessToken, refreshToken } = await authService.refresh(tokenFromCookie)

  setTokens(res, refreshToken.token, accessToken)

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

export const updateProfile = async (req: Request, res: Response) => {
  const data = UpdateProfileInput.parse(req.body)
  const userId = (req as any).userId

  const user = await authService.updateProfile(userId, data)

  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    surname: user.surname,
  })
}

export const updateRole = async (req: Request, res: Response) => {
  const data = UpdateRoleInput.parse(req.body)
  
  // Проверяем, что текущий пользователь - админ
  const currentUserRole = (req as any).userRole
  if (currentUserRole !== 'admin') {
    return res.status(403).json({ message: 'Only admins can change user roles' })
  }

  const user = await authService.updateUserRole(data.userId, data.role)

  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    surname: user.surname,
  })
}