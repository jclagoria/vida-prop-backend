import { User } from '@/modules/user-management/domain/entities/user.entity.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('User', () => {
  const validProps = {
    id: UserId.create('123e4567-e89b-12d3-a456-426614174000'),
    email: Email.create('test@example.com'),
    passwordHash: 'hashed_password',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  describe('create', () => {
    it('should create User with valid props', () => {
      const user = User.create(validProps)
      expect(user.id.value).toBe(validProps.id.value)
      expect(user.email.value).toBe(validProps.email.value)
      expect(user.role).toBe(validProps.role)
      expect(user.isActive).toBe(true)
    })

    it('should set isActive to true by default', () => {
      const props = { ...validProps, isActive: undefined }
      const user = User.create(props)
      expect(user.isActive).toBe(true)
    })
  })

  describe('deactivate', () => {
    it('should deactivate user', () => {
      const user = User.create(validProps)
      user.deactivate()
      expect(user.isActive).toBe(false)
    })

    it('should not allow deactivation twice', () => {
      const user = User.create(validProps)
      user.deactivate()
      expect(() => user.deactivate()).toThrow('User already deactivated')
    })
  })

  describe('reactivate', () => {
    it('should reactivate deactivated user', () => {
      const user = User.create(validProps)
      user.deactivate()
      user.reactivate()
      expect(user.isActive).toBe(true)
    })

    it('should throw when reactivating active user', () => {
      const user = User.create(validProps)
      expect(() => user.reactivate()).toThrow('User is already active')
    })
  })

  describe('changeRole', () => {
    it('should change user role', () => {
      const user = User.create(validProps)
      user.changeRole(UserRole.TENANT)
      expect(user.role).toBe(UserRole.TENANT)
    })
  })

  describe('equals', () => {
    it('should return true for same id', () => {
      const user1 = User.create(validProps)
      const user2 = User.create(validProps)
      expect(user1.equals(user2)).toBe(true)
    })

    it('should return false for different ids', () => {
      const user1 = User.create(validProps)
      const user2 = User.create({
        ...validProps,
        id: UserId.create('223e4567-e89b-12d3-a456-426614174000'),
      })
      expect(user1.equals(user2)).toBe(false)
    })
  })
})
