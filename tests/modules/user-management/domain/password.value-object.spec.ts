import { Password } from '@/modules/user-management/domain/value-objects/password.value-object'

describe('Password Value Object', () => {
  describe('constructor', () => {
    it('should create password with valid value', () => {
      const password = new Password('ValidPass123')
      expect(password.getValue()).toBe('ValidPass123')
    })

    it('should throw error for empty password', () => {
      expect(() => new Password('')).toThrow('Password cannot be empty')
    })

    it('should throw error for null value', () => {
      expect(() => new Password(null as never)).toThrow('Password cannot be empty')
    })
  })

  describe('meetsPolicy', () => {
    it('should return true for valid password', () => {
      const password = new Password('ValidPass123')
      expect(password.meetsPolicy()).toBe(true)
    })

    it('should return false for password shorter than 8 characters', () => {
      const password = new Password('Short1')
      expect(password.meetsPolicy()).toBe(false)
    })

    it('should return false for password without uppercase', () => {
      const password = new Password('lowercase123')
      expect(password.meetsPolicy()).toBe(false)
    })

    it('should return false for password without numbers', () => {
      const password = new Password('AllLetters')
      expect(password.meetsPolicy()).toBe(false)
    })

    it('should return false for password missing multiple requirements', () => {
      const password = new Password('weak')
      expect(password.meetsPolicy()).toBe(false)
    })
  })

  describe('getPolicyErrors', () => {
    it('should return empty array for valid password', () => {
      const password = new Password('ValidPass123')
      expect(password.getPolicyErrors()).toHaveLength(0)
    })

    it('should return error for short password', () => {
      const password = new Password('abc')
      const errors = password.getPolicyErrors()
      expect(errors).toContain('Password must have at least 8 characters')
    })

    it('should return error for missing uppercase', () => {
      const password = new Password('lowercase123')
      const errors = password.getPolicyErrors()
      expect(errors).toContain('Password must have at least 1 uppercase letter')
    })

    it('should return error for missing number', () => {
      const password = new Password('AllLetters')
      const errors = password.getPolicyErrors()
      expect(errors).toContain('Password must have at least 1 number')
    })

    it('should return multiple errors for weak password', () => {
      const password = new Password('weak')
      const errors = password.getPolicyErrors()
      expect(errors.length).toBeGreaterThan(1)
    })
  })
})
