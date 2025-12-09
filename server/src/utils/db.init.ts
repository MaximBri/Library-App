import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function initializeDatabase() {
  try {
    await prisma.$connect()
    console.log('Connected to database')

    const tableExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'User'
      );
    `

    if (!tableExists[0]?.exists) {
      console.log('Tables do not exist. Please run migrations manually.')
      console.log('   Run: npx prisma migrate deploy')
      throw new Error('Database schema is not initialized')
    }

    const adminCount = await prisma.user.count({
      where: { role: 'admin' }
    })

    if (adminCount === 0) {
      console.log('⚠️  No admin user found. Creating default admin...')
      await createDefaultAdmin()
    } else {
      console.log('Admin user exists')
    }

    console.log('Database initialization complete')
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

async function createDefaultAdmin() {
  const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@library.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  try {
    const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS)
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'admin',
        name: 'Admin',
        surname: 'User',
      },
    })

    console.log('Default admin created:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
  } catch (error) {
    console.error('Failed to create admin user:', error)
    throw error
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
}