import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'

describe('Email', () => {
  describe('create', () => {
    it('should create valid Email from valid address', () => {
      const email = Email.create('test@example.com')
      expect(email.value).toBe('test@example.com')
    })

    it('should create valid Email from valid address with subdomain', () => {
      const email = Email.create('user@mail.example.com')
      expect(email.value).toBe('user@mail.example.com')
    })

    it('should throw error for invalid email format', () => {
      expect(() => Email.create('invalid-email')).toThrow('Invalid email format')
    })

    it('should throw error for empty string', () => {
      expect(() => Email.create('')).toThrow('Invalid email format')
    })

    it('should throw error for email without domain', () => {
      expect(() => Email.create('test@')).toThrow('Invalid email format')
    })

    it('should throw error for email without @', () => {
      expect(() => Email.create('testexample.com')).toThrow('Invalid email format')
    })
  })

  describe('equals', () => {
    it('should return true for same value (case-insensitive)', () => {
      const email1 = Email.create('Test@Example.com')
      const email2 = Email.create('test@example.com')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return false for different values', () => {
      const email1 = Email.create('test1@example.com')
      const email2 = Email.create('test2@example.com')
      expect(email1.equals(email2)).toBe(false)
    })
  })
})
