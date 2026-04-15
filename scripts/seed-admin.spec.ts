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
      const { validateEnvVars } = await import('./seed-admin.mjs')
      const result = await validateEnvVars()

      expect(result.email).toBe('admin@habitat.com')
      expect(result.password).toBe('SecurePass123')
      expect(result.name).toBe('System Administrator')
    })
  })

  describe('validatePasswordPolicy', () => {
    it('should throw if password is less than 8 characters', async () => {
      const { validatePasswordPolicy } = await import('./seed-admin.mjs')

      await expect(validatePasswordPolicy('Short1')).rejects.toThrow(
        'Password must be at least 8 characters'
      )
    })

    it('should throw if password lacks uppercase letter', async () => {
      const { validatePasswordPolicy } = await import('./seed-admin.mjs')

      await expect(validatePasswordPolicy('password1')).rejects.toThrow(
        'Password must contain at least one uppercase letter'
      )
    })

    it('should throw if password lacks number', async () => {
      const { validatePasswordPolicy } = await import('./seed-admin.mjs')

      await expect(validatePasswordPolicy('Password')).rejects.toThrow(
        'Password must contain at least one number'
      )
    })

    it('should resolve for valid password', async () => {
      const { validatePasswordPolicy } = await import('./seed-admin.mjs')

      await expect(validatePasswordPolicy('SecurePass123')).resolves.toBeUndefined()
    })
  })
})
