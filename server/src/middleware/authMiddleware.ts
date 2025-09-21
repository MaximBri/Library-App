import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  if (!token)
    return res.status(401).json({ message: 'Unauthorized' })
  const payload = verifyAccessToken(token)
  if (!payload) return res.status(401).json({ message: 'Unauthorized' })

  ;(req as any).userId = payload.userId
  ;(req as any).userRole = payload.role
  return next()
}
