import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity.js'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('Invitation', () => {
  const futureDate = new Date()
  futureDate.setFullYear(futureDate.getFullYear() + 1)

  const validProps = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: Email.create('test@example.com'),
    role: UserRole.TENANT,
    token: 'valid-token-123',
    status: InvitationStatus.PENDING,
    expiresAt: futureDate,
    createdById: UserId.create('223e4567-e89b-12d3-a456-426614174000'),
    apartmentId: 'apartment-123',
    buildingId: 'building-456',
    createdAt: new Date('2024-01-01'),
  }

  describe('create', () => {
    it('should create Invitation with valid props', () => {
      const invitation = Invitation.create(validProps)
      expect(invitation.id).toBe(validProps.id)
      expect(invitation.email.value).toBe(validProps.email.value)
      expect(invitation.role).toBe(validProps.role)
      expect(invitation.status).toBe(InvitationStatus.PENDING)
    })

    it('should default status to PENDING', () => {
      const props = { ...validProps, status: undefined }
      const invitation = Invitation.create(props)
      expect(invitation.status).toBe(InvitationStatus.PENDING)
    })
  })

  describe('accept', () => {
    it('should accept valid invitation', () => {
      const invitation = Invitation.create(validProps)
      invitation.accept()
      expect(invitation.status).toBe(InvitationStatus.ACCEPTED)
    })

    it('should throw when accepting expired invitation', () => {
      const invitation = Invitation.create({
        ...validProps,
        expiresAt: new Date('2020-01-01'),
      })
      expect(() => invitation.accept()).toThrow('Invitation has expired')
    })

    it('should throw when accepting cancelled invitation', () => {
      const invitation = Invitation.create(validProps)
      invitation.cancel()
      expect(() => invitation.accept()).toThrow('Invitation cannot be accepted')
    })
  })

  describe('cancel', () => {
    it('should cancel pending invitation', () => {
      const invitation = Invitation.create(validProps)
      invitation.cancel()
      expect(invitation.status).toBe(InvitationStatus.CANCELLED)
    })

    it('should throw when cancelling accepted invitation', () => {
      const invitation = Invitation.create(validProps)
      invitation.accept()
      expect(() => invitation.cancel()).toThrow('Invitation cannot be cancelled')
    })
  })

  describe('isExpired', () => {
    it('should return true for expired invitation', () => {
      const invitation = Invitation.create({
        ...validProps,
        expiresAt: new Date('2020-01-01'),
      })
      expect(invitation.isExpired()).toBe(true)
    })

    it('should return false for non-expired invitation', () => {
      const invitation = Invitation.create(validProps)
      expect(invitation.isExpired()).toBe(false)
    })
  })
})
