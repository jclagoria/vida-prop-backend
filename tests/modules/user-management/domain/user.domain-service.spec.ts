import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import {
  type CreateUserInput,
  UserDomainService,
} from '@/modules/user-management/domain/services/user.domain-service'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { Password } from '@/modules/user-management/domain/value-objects/password.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('UserDomainService', () => {
  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }

  const makeService = (): UserDomainService => {
    const service = new UserDomainService(mockLogger as never)
    return service
  }

  const makeUser = (props?: {
    id?: string
    email?: string
    role?: UserRole
    isActive?: boolean
  }) => {
    return new User({
      id: new UserId(props?.id ?? 'test-uuid'),
      email: new Email(props?.email ?? 'test@habitat.com'),
      passwordHash: 'hashed_password',
      role: props?.role ?? UserRole.ADMIN,
      isActive: props?.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  const makeInput = (
    email: string,
    password: string,
    role: UserRole = UserRole.TENANT
  ): CreateUserInput => {
    return {
      email: new Email(email) as never,
      password: new Password(password) as never,
      role,
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create user with valid input', () => {
      const service = makeService()
      const input = makeInput('new@habitat.com', 'ValidPass123!')

      const user = service.createUser(input)

      expect(user).toBeInstanceOf(User)
      expect(user.email.getValue()).toBe('new@habitat.com')
      expect(user.role).toBe(UserRole.TENANT)
      expect(user.isActive).toBe(true)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
    })

    it('should throw error when password does not meet policy', () => {
      const service = makeService()
      const input = makeInput('new@habitat.com', 'weak')

      expect(() => service.createUser(input)).toThrow('Password must have at least')
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })

  describe('validateUserCreation', () => {
    it('should return valid for correct email and password', () => {
      const service = makeService()
      const input = makeInput('valid@habitat.com', 'ValidPass123!')

      const result = service.validateUserCreation(input)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return invalid for weak password', () => {
      const service = makeService()
      const input = makeInput('valid@habitat.com', 'weak')

      const result = service.validateUserCreation(input)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('canManageUser', () => {
    it('should return true when actor is admin', () => {
      const service = makeService()
      const actor = makeUser({ role: UserRole.ADMIN })
      const target = makeUser({ id: 'other-id' })

      expect(service.canManageUser(actor, target)).toBe(true)
    })

    it('should return true when actor is same as target', () => {
      const service = makeService()
      const actor = makeUser({ id: 'same-id' })
      const target = makeUser({ id: 'same-id' })

      expect(service.canManageUser(actor, target)).toBe(true)
    })

    it('should return false when actor is different from target and not admin', () => {
      const service = makeService()
      const actor = makeUser({ id: 'actor-id', role: UserRole.TENANT })
      const target = makeUser({ id: 'target-id' })

      expect(service.canManageUser(actor, target)).toBe(false)
    })
  })

  describe('canInviteUser', () => {
    it('should return true for admin', () => {
      const service = makeService()
      const inviter = makeUser({ role: UserRole.ADMIN })

      expect(service.canInviteUser(inviter, UserRole.TENANT)).toBe(true)
    })

    it('should return true for owner inviting tenant', () => {
      const service = makeService()
      const inviter = makeUser({ role: UserRole.OWNER })

      expect(service.canInviteUser(inviter, UserRole.TENANT)).toBe(true)
    })

    it('should return false for tenant trying to invite', () => {
      const service = makeService()
      const inviter = makeUser({ role: UserRole.TENANT })

      expect(service.canInviteUser(inviter, UserRole.ADMIN)).toBe(false)
    })

    it('should return false for owner trying to invite admin', () => {
      const service = makeService()
      const inviter = makeUser({ role: UserRole.OWNER })

      expect(service.canInviteUser(inviter, UserRole.ADMIN)).toBe(false)
    })
  })
})
