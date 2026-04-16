import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('UserId Value Object', () => {
  describe('constructor', () => {
    it('should create UserId with valid value', () => {
      const id = new UserId('test-uuid')
      expect(id.toString()).toBe('test-uuid')
    })

    it('should reject empty value', () => {
      expect(() => new UserId('')).toThrow('UserId cannot be empty')
    })

    it('should reject whitespace only', () => {
      expect(() => new UserId('   ')).toThrow('UserId cannot be empty')
    })
  })

  describe('equals', () => {
    it('should return true for same value', () => {
      const id1 = new UserId('same-uuid')
      const id2 = new UserId('same-uuid')
      expect(id1.equals(id2)).toBe(true)
    })

    it('should return false for different value', () => {
      const id1 = new UserId('uuid1')
      const id2 = new UserId('uuid2')
      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the value', () => {
      const id = new UserId('test-uuid')
      expect(id.toString()).toBe('test-uuid')
    })
  })
})
