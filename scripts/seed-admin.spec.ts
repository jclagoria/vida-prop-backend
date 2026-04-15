jest.mock('dotenv', () => ({
  config: jest.fn(),
}))

describe('seed-admin', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('validateEnvVars', () => {
    it('should resolve with valid env vars', async () => {
      process.env.INITIAL_ADMIN_EMAIL = 'admin@habitat.com'
      process.env.INITIAL_ADMIN_PASSWORD = 'SecurePass123'
      process.env.INITIAL_ADMIN_NAME = 'System Administrator'

      const { validateEnvVars } = await import('./seed-admin')
      const result = validateEnvVars()

      expect(result.email).toBe('admin@habitat.com')
      expect(result.password).toBe('SecurePass123')
      expect(result.name).toBe('System Administrator')
    })

    it('should throw if env vars missing', async () => {
      delete process.env.INITIAL_ADMIN_EMAIL
      delete process.env.INITIAL_ADMIN_PASSWORD
      delete process.env.INITIAL_ADMIN_NAME

      const { validateEnvVars } = await import('./seed-admin')
      expect(() => validateEnvVars()).toThrow(
        'Missing required env vars INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD, INITIAL_ADMIN_NAME'
      )
    })
  })

  describe('validatePasswordPolicy', () => {
    it('should throw if password is less than 8 characters', async () => {
      process.env.INITIAL_ADMIN_EMAIL = 'admin@habitat.com'
      process.env.INITIAL_ADMIN_PASSWORD = 'SecurePass123'
      process.env.INITIAL_ADMIN_NAME = 'System Administrator'

      const { validatePasswordPolicy } = await import('./seed-admin')

      await expect(validatePasswordPolicy('Short1')).rejects.toThrow(
        'Password must be at least 8 characters'
      )
    })

    it('should throw if password lacks uppercase letter', async () => {
      process.env.INITIAL_ADMIN_EMAIL = 'admin@habitat.com'
      process.env.INITIAL_ADMIN_PASSWORD = 'SecurePass123'
      process.env.INITIAL_ADMIN_NAME = 'System Administrator'

      const { validatePasswordPolicy } = await import('./seed-admin')

      await expect(validatePasswordPolicy('password1')).rejects.toThrow(
        'Password must contain at least one uppercase letter'
      )
    })

    it('should throw if password lacks number', async () => {
      process.env.INITIAL_ADMIN_EMAIL = 'admin@habitat.com'
      process.env.INITIAL_ADMIN_PASSWORD = 'SecurePass123'
      process.env.INITIAL_ADMIN_NAME = 'System Administrator'

      const { validatePasswordPolicy } = await import('./seed-admin')

      await expect(validatePasswordPolicy('Password')).rejects.toThrow(
        'Password must contain at least one number'
      )
    })

    it('should resolve for valid password', async () => {
      process.env.INITIAL_ADMIN_EMAIL = 'admin@habitat.com'
      process.env.INITIAL_ADMIN_PASSWORD = 'SecurePass123'
      process.env.INITIAL_ADMIN_NAME = 'System Administrator'

      const { validatePasswordPolicy } = await import('./seed-admin')

      await expect(validatePasswordPolicy('SecurePass123')).resolves.toBeUndefined()
    })
  })
})
