import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('UserId', () => {
  describe('create', () => {
    it('should create valid UserId from valid UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      const userId = UserId.create(uuid)
      expect(userId.value).toBe(uuid)
    })

    it('should throw error for invalid UUID format', () => {
      expect(() => UserId.create('invalid-uuid')).toThrow('Invalid UUID format')
    })

    it('should throw error for empty string', () => {
      expect(() => UserId.create('')).toThrow('Invalid UUID format')
    })
  })

  describe('immutability', () => {
    it('should not expose setter for value', () => {
      const userId = UserId.create('123e4567-e89b-12d3-a456-426614174000')
      expect(() => {
        ;(userId as any).value = 'new-uuid'
      }).toThrow()
    })
  })

  describe('equals', () => {
    it('should return true for same value', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      const userId1 = UserId.create(uuid)
      const userId2 = UserId.create(uuid)
      expect(userId1.equals(userId2)).toBe(true)
    })

    it('should return false for different values', () => {
      const userId1 = UserId.create('123e4567-e89b-12d3-a456-426614174000')
      const userId2 = UserId.create('223e4567-e89b-12d3-a456-426614174000')
      expect(userId1.equals(userId2)).toBe(false)
    })
  })
})
