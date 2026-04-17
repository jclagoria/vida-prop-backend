import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import {
  type CreateInvitationInput,
  InvitationDomainService,
} from '@/modules/user-management/domain/services/invitation.domain-service'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('InvitationDomainService', () => {
  const makeService = (): InvitationDomainService => {
    return new InvitationDomainService()
  }

  const makeUser = (props?: { id?: string; role?: UserRole }): User => {
    return new User({
      id: new UserId(props?.id ?? 'test-uuid'),
      email: new Email('test@habitat.com'),
      passwordHash: 'hashed',
      role: props?.role ?? UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  const makeInvitation = (status: InvitationStatus = InvitationStatus.PENDING): Invitation => {
    return new Invitation({
      id: 'invite-id',
      email: 'invite@habitat.com',
      role: UserRole.TENANT,
      token: 'token',
      status,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      createdById: 'creator-id',
    })
  }

  const makeExpiredInvitation = (): Invitation => {
    return new Invitation({
      id: 'expired-id',
      email: 'expired@habitat.com',
      role: UserRole.TENANT,
      token: 'token',
      status: InvitationStatus.PENDING,
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      createdById: 'creator-id',
    })
  }

  const makeInput = (email: string, role: UserRole): CreateInvitationInput => {
    return {
      email,
      role,
      createdById: 'creator-id',
    }
  }

  describe('createInvitation', () => {
    it('should create invitation with valid input', () => {
      const service = makeService()
      const input = makeInput('new@habitat.com', UserRole.TENANT)

      const invitation = service.createInvitation(input)

      expect(invitation).toBeInstanceOf(Invitation)
      expect(invitation.email).toBe('new@habitat.com')
      expect(invitation.role).toBe(UserRole.TENANT)
      expect(invitation.status).toBe(InvitationStatus.PENDING)
      expect(invitation.token).toBeTruthy()
    })
  })

  describe('validateInvitationCreation', () => {
    it('should return valid for correct input', () => {
      const service = makeService()
      const input = makeInput('valid@habitat.com', UserRole.TENANT)

      const result = service.validateInvitationCreation(input)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return invalid for invalid email format', () => {
      const service = makeService()
      const input = makeInput('invalid-email', UserRole.TENANT)

      const result = service.validateInvitationCreation(input)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Invalid email format')
    })

    it('should return invalid for missing creator ID', () => {
      const service = makeService()
      const input: CreateInvitationInput = {
        email: 'test@habitat.com',
        role: UserRole.TENANT,
        createdById: '',
      }

      const result = service.validateInvitationCreation(input)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Creator ID is required')
    })

    it('should return invalid for invalid role', () => {
      const service = makeService()
      const input = makeInput('test@habitat.com', 'INVALID' as UserRole)

      const result = service.validateInvitationCreation(input)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Invalid role')
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

  describe('canAcceptInvitation', () => {
    it('should return true for valid invitation', () => {
      const service = makeService()
      const invitation = makeInvitation()

      expect(service.canAcceptInvitation(invitation)).toBe(true)
    })

    it('should return false for expired invitation', () => {
      const service = makeService()
      const invitation = makeExpiredInvitation()

      expect(service.canAcceptInvitation(invitation)).toBe(false)
    })

    it('should return false for accepted invitation', () => {
      const service = makeService()
      const invitation = makeInvitation(InvitationStatus.ACCEPTED)

      expect(service.canAcceptInvitation(invitation)).toBe(false)
    })
  })

  describe('isInvitationValid', () => {
    it('should return true for pending non-expired', () => {
      const service = makeService()
      const invitation = makeInvitation()

      expect(service.isInvitationValid(invitation)).toBe(true)
    })

    it('should return false for expired', () => {
      const service = makeService()
      const invitation = makeExpiredInvitation()

      expect(service.isInvitationValid(invitation)).toBe(false)
    })

    it('should return false for accepted', () => {
      const service = makeService()
      const invitation = makeInvitation(InvitationStatus.ACCEPTED)

      expect(service.isInvitationValid(invitation)).toBe(false)
    })
  })

  describe('calculateExpiry', () => {
    it('should calculate expiry with default days', () => {
      const service = makeService()

      const expiry = service.calculateExpiry()

      expect(expiry.getTime()).toBeGreaterThan(Date.now())
    })

    it('should calculate expiry with custom days', () => {
      const service = makeService()

      const expiry = service.calculateExpiry(14)

      const expectedDays = 14 * 24 * 60 * 60 * 1000
      const diff = expiry.getTime() - Date.now()
      expect(diff).toBeCloseTo(expectedDays, -3)
    })
  })
})
