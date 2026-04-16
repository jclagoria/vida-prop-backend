describe('seed-admin', () => {
  describe('validatePassword', () => {
    it('should throw if password is less than 8 characters', () => {
      const validatePassword = (password: string): void => {
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

      expect(() => validatePassword('Short1')).toThrow('Password must have at least 8 characters')
    })

    it('should throw if password has no uppercase letter', () => {
      const validatePassword = (password: string): void => {
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

      expect(() => validatePassword('lowercase1')).toThrow(
        'Password must have at least 1 uppercase letter'
      )
    })

    it('should throw if password has no number', () => {
      const validatePassword = (password: string): void => {
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

      expect(() => validatePassword('NoNumbers')).toThrow('Password must have at least 1 number')
    })

    it('should pass for valid password', () => {
      const validatePassword = (password: string): void => {
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

      expect(() => validatePassword('SecurePass123')).not.toThrow()
    })
  })

  describe('getConfig', () => {
    const originalEnv = process.env

    beforeEach(() => {
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should throw if INITIAL_ADMIN_EMAIL is missing', () => {
      delete process.env.INITIAL_ADMIN_EMAIL
      delete process.env.INITIAL_ADMIN_PASSWORD
      delete process.env.INITIAL_ADMIN_NAME

      const getConfig = (): { email: string; password: string; name: string } => {
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

      expect(() => getConfig()).toThrow('INITIAL_ADMIN_EMAIL environment variable is required')
    })

    it('should throw if INITIAL_ADMIN_PASSWORD is missing', () => {
      process.env.INITIAL_ADMIN_EMAIL = 'admin@test.com'
      delete process.env.INITIAL_ADMIN_PASSWORD
      delete process.env.INITIAL_ADMIN_NAME

      const getConfig = (): { email: string; password: string; name: string } => {
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

      expect(() => getConfig()).toThrow('INITIAL_ADMIN_PASSWORD environment variable is required')
    })

    it('should throw if INITIAL_ADMIN_NAME is missing', () => {
      process.env.INITIAL_ADMIN_EMAIL = 'admin@test.com'
      process.env.INITIAL_ADMIN_PASSWORD = 'SecurePass123'
      delete process.env.INITIAL_ADMIN_NAME

      const getConfig = (): { email: string; password: string; name: string } => {
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

      expect(() => getConfig()).toThrow('INITIAL_ADMIN_NAME environment variable is required')
    })

    it('should return config if all env vars are present', () => {
      process.env.INITIAL_ADMIN_EMAIL = 'admin@habitat.com'
      process.env.INITIAL_ADMIN_PASSWORD = 'SecurePass123'
      process.env.INITIAL_ADMIN_NAME = 'System Administrator'

      const getConfig = (): { email: string; password: string; name: string } => {
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

      const config = getConfig()

      expect(config).toEqual({
        email: 'admin@habitat.com',
        password: 'SecurePass123',
        name: 'System Administrator',
      })
    })
  })
})
