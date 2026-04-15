import { Password } from '@/modules/user-management/domain/value-objects/password.value-object.js'

describe('Password', () => {
  describe('create', () => {
    it('should create Password from valid password', () => {
      const password = Password.create('SecurePass123')
      expect(password.value).toBe('SecurePass123')
    })

    it('should throw error for password less than 8 characters', () => {
      expect(() => Password.create('Short1')).toThrow('Password must be at least 8 characters')
    })

    it('should throw error for password without uppercase', () => {
      expect(() => Password.create('password123')).toThrow(
        'Password must contain at least one uppercase letter'
      )
    })

    it('should throw error for password without number', () => {
      expect(() => Password.create('Passwordabc')).toThrow(
        'Password must contain at least one number'
      )
    })

    it('should throw error for empty string', () => {
      expect(() => Password.create('')).toThrow('Password is required')
    })
  })

  describe('equals', () => {
    it('should return true for same password', () => {
      const password1 = Password.create('SecurePass123')
      const password2 = Password.create('SecurePass123')
      expect(password1.equals(password2)).toBe(true)
    })

    it('should return false for different passwords', () => {
      const password1 = Password.create('SecurePass123')
      const password2 = Password.create('Different123')
      expect(password1.equals(password2)).toBe(false)
    })
  })
})
