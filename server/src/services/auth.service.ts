import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt'
import { hashToken, compareTokenHash } from '../utils/hash'
import z from 'zod'

const prisma = new PrismaClient()

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12)

export async function register({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw { status: 400, message: 'Такая почта уже существует' }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await prisma.user.create({
    data: { email, passwordHash, role: 'user' },
  })
  return user
}

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw { status: 401, message: 'Invalid credentials' }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) throw { status: 401, message: 'Invalid credentials' }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role })
  const rawRefresh = generateRefreshToken({ userId: user.id })
  const refreshHash = await hashToken(rawRefresh.token)

  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshHash,
      userId: user.id,
      expiresAt: rawRefresh.expiresAt,
    },
  })

  return { accessToken, refreshToken: rawRefresh }
}

export async function refresh(token: string) {
  const payload = verifyRefreshToken(token)

  const tokens = await prisma.refreshToken.findMany({
    where: {
      userId: payload.userId,
      revoked: false,
      expiresAt: { gt: new Date() },
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  })

  let matched = null
  for (const t of tokens) {
    const isMatch = await compareTokenHash(token, t.tokenHash)
    if (isMatch) {
      matched = t
      break
    }
  }

  if (!matched) throw { status: 401, message: 'Refresh token not found' }
  if (matched.expiresAt < new Date())
    throw { status: 401, message: 'Refresh token expired' }

  await prisma.refreshToken.update({
    where: { id: matched.id },
    data: { revoked: true },
  })

  const rawRefresh = generateRefreshToken({ userId: payload.userId })
  const refreshHash = await hashToken(rawRefresh.token)
  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshHash,
      userId: payload.userId,
      expiresAt: rawRefresh.expiresAt,
    },
  })

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  const accessToken = generateAccessToken({
    userId: payload.userId,
    role: user?.role ?? 'user',
  })

  return { accessToken, refreshToken: rawRefresh }
}

export async function logout(token: string) {
  const payload = verifyRefreshToken(token)
  await prisma.refreshToken.updateMany({
    where: { userId: payload.userId },
    data: { revoked: true },
  })
  return
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } })
}

export async function updateProfile(
  userId: number,
  data: { name?: string | null; surname?: string | null }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      surname: data.surname,
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      surname: true,
    },
  })
  return user
}

export async function updateUserRole(userId: number, role: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw { status: 404, message: 'User not found' }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      surname: true,
    },
  })

  return updatedUser
}
