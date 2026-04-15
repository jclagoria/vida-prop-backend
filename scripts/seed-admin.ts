import 'dotenv/config'

export function validateEnvVars() {
  const email = process.env.INITIAL_ADMIN_EMAIL
  const password = process.env.INITIAL_ADMIN_PASSWORD
  const name = process.env.INITIAL_ADMIN_NAME

  if (!email || !password || !name) {
    throw new Error(
      'Missing required env vars INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD, INITIAL_ADMIN_NAME'
    )
  }

  return { email, password, name }
}

export async function validatePasswordPolicy(password: string): Promise<void> {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter')
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number')
  }
}

export async function seedAdmin() {
  const { email, password, name } = validateEnvVars()
  await validatePasswordPolicy(password)

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require('@prisma/adapter-pg')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { hash } = require('bcrypt')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pg = require('pg')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client')

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

if (require.main === module) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
