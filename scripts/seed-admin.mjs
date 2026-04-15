import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'bcrypt'
import pg from 'pg'
import { PrismaClient } from '../prisma/generated/client.ts'

async function seedAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL
  const password = process.env.INITIAL_ADMIN_PASSWORD
  const name = process.env.INITIAL_ADMIN_NAME

  if (!email || !password || !name) {
    throw new Error(
      'Missing required env vars INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD, INITIAL_ADMIN_NAME'
    )
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter')
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number')
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const existing = await prisma.users.findUnique({
      where: { email },
    })

    if (existing) {
      console.log(`Admin ${email} already exists, skipping`)
      return null
    }

    const passwordHash = await hash(password, 10)

    const admin = await prisma.users.create({
      data: {
        email,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    })

    console.log(`Admin created: ${email}`)
    return { id: admin.id, email: admin.email, role: admin.role }
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
