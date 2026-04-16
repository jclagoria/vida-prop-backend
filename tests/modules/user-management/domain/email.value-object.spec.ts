import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should accept valid email', () => {
      const email = new Email('test@habitat.com')
      expect(email.getValue()).toBe('test@habitat.com')
    })

    it('should accept email with subdomain', () => {
      const email = new Email('user@mail.habitat.com')
      expect(email.getValue()).toBe('user@mail.habitat.com')
    })

    it('should lowercase email', () => {
      const email = new Email('TEST@HABITAT.COM')
      expect(email.getValue()).toBe('test@habitat.com')
    })

    it('should trim whitespace', () => {
      const email = new Email('  test@habitat.com  ')
      expect(email.getValue()).toBe('test@habitat.com')
    })

    it('should reject invalid email', () => {
      expect(() => new Email('invalid')).toThrow('Invalid email format')
    })

    it('should reject email without @', () => {
      expect(() => new Email('testhabitat.com')).toThrow('Invalid email format')
    })

    it('should reject email without domain', () => {
      expect(() => new Email('test@')).toThrow('Invalid email format')
    })

    it('should reject empty email', () => {
      expect(() => new Email('')).toThrow('Invalid email format')
    })
  })

  describe('equals', () => {
    it('should return true for same email', () => {
      const email1 = new Email('test@habitat.com')
      const email2 = new Email('test@habitat.com')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return false for different email', () => {
      const email1 = new Email('test1@habitat.com')
      const email2 = new Email('test2@habitat.com')
      expect(email1.equals(email2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return email value', () => {
      const email = new Email('test@habitat.com')
      expect(email.toString()).toBe('test@habitat.com')
    })
  })
})
