import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const SALT_ROUNDS = 12

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@library.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log('Admin user already exists')
    return
  }

  const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS)
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: 'admin',
      name: 'Admin',
      surname: 'User',
    },
  })

  console.log('Дефолтный админ создан:')
  console.log(`Email: ${admin.email}`)
  console.log(`Пароль: ${adminPassword}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
