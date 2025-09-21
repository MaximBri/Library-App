import bcrypt from 'bcrypt'

const HASH_ROUNDS = 12

export async function hashToken(token: string) {
  return bcrypt.hash(token, HASH_ROUNDS)
}

export async function compareTokenHash(token: string, hash: string) {
  return bcrypt.compare(token, hash)
}
