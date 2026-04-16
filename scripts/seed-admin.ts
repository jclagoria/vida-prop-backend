import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'
import { Pool } from 'pg'
import { PrismaClient, UserRole } from '../prisma/generated/client.js'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

interface SeedConfig {
  email: string
  password: string
  name: string
}

export function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new Error('Password must have at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must have at least 1 uppercase letter')
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must have at least 1 number')
  }
}

export function getConfig(): SeedConfig {
  const email = process.env.INITIAL_ADMIN_EMAIL
  const password = process.env.INITIAL_ADMIN_PASSWORD
  const name = process.env.INITIAL_ADMIN_NAME

  if (!email) {
    throw new Error('INITIAL_ADMIN_EMAIL environment variable is required')
  }
  if (!password) {
    throw new Error('INITIAL_ADMIN_PASSWORD environment variable is required')
  }
  if (!name) {
    throw new Error('INITIAL_ADMIN_NAME environment variable is required')
  }

  return { email, password, name }
}

export async function seed(): Promise<void> {
  const config = getConfig()

  console.log(`Checking for existing admin with email: ${config.email}`)

  const existingAdmin = await prisma.user.findUnique({
    where: { email: config.email },
  })

  if (existingAdmin) {
    console.log('Admin already exists, skipping seed (idempotent)')
    return
  }

  console.log('Validating password policy...')
  validatePassword(config.password)

  console.log('Hashing password with bcrypt...')
  const passwordHash = await bcrypt.hash(config.password, 10)

  console.log('Creating admin user...')
  await prisma.user.create({
    data: {
      email: config.email,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  })

  console.log('Admin created successfully')
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
