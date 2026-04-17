import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('Invitation Entity', () => {
  const makeInvitation = (props?: {
    id?: string
    email?: string
    role?: UserRole
    status?: InvitationStatus
    expiresAt?: Date
  }) => {
    return new Invitation({
      id: props?.id ?? 'test-invite-id',
      email: props?.email ?? 'invite@habitat.com',
      role: props?.role ?? UserRole.TENANT,
      token: 'test-token',
      status: props?.status ?? InvitationStatus.PENDING,
      expiresAt: props?.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      createdById: 'creator-id',
    })
  }

  it('should create invitation with all required fields', () => {
    const invitation = makeInvitation()
    expect(invitation.id).toBe('test-invite-id')
    expect(invitation.email).toBe('invite@habitat.com')
    expect(invitation.status).toBe(InvitationStatus.PENDING)
  })

  it('isPending returns true for pending status', () => {
    const invitation = makeInvitation({ status: InvitationStatus.PENDING })
    expect(invitation.isPending()).toBe(true)
  })

  it('isPending returns false for non-pending status', () => {
    const invitation = makeInvitation({ status: InvitationStatus.ACCEPTED })
    expect(invitation.isPending()).toBe(false)
  })

  it('isExpired returns true when past expiry', () => {
    const invitation = makeInvitation({
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    })
    expect(invitation.isExpired()).toBe(true)
  })

  it('isExpired returns false when not past expiry', () => {
    const invitation = makeInvitation({
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    expect(invitation.isExpired()).toBe(false)
  })

  it('canBeAccepted returns true for pending non-expired', () => {
    const invitation = makeInvitation({
      status: InvitationStatus.PENDING,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    expect(invitation.canBeAccepted()).toBe(true)
  })

  it('canBeAccepted returns false for expired', () => {
    const invitation = makeInvitation({
      status: InvitationStatus.PENDING,
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    })
    expect(invitation.canBeAccepted()).toBe(false)
  })

  it('canBeAccepted returns false for accepted', () => {
    const invitation = makeInvitation({ status: InvitationStatus.ACCEPTED })
    expect(invitation.canBeAccepted()).toBe(false)
  })

  it('canBeAccepted returns false for cancelled', () => {
    const invitation = makeInvitation({ status: InvitationStatus.CANCELLED })
    expect(invitation.canBeAccepted()).toBe(false)
  })

  it('accept returns accepted invitation', () => {
    const invitation = makeInvitation()
    const accepted = invitation.accept()
    expect(accepted.status).toBe(InvitationStatus.ACCEPTED)
  })

  it('accept throws error for non-accepted invitation', () => {
    const invitation = makeInvitation({ status: InvitationStatus.CANCELLED })
    expect(() => invitation.accept()).toThrow('Invitation cannot be accepted')
  })

  it('expire returns expired invitation', () => {
    const invitation = makeInvitation()
    const expired = invitation.expire()
    expect(expired.status).toBe(InvitationStatus.EXPIRED)
  })

  it('cancel returns cancelled invitation', () => {
    const invitation = makeInvitation()
    const cancelled = invitation.cancel()
    expect(cancelled.status).toBe(InvitationStatus.CANCELLED)
  })

  it('equals returns true for same id', () => {
    const inv1 = makeInvitation({ id: 'same' })
    const inv2 = makeInvitation({ id: 'same' })
    expect(inv1.equals(inv2)).toBe(true)
  })

  it('equals returns false for different id', () => {
    const inv1 = makeInvitation({ id: 'id1' })
    const inv2 = makeInvitation({ id: 'id2' })
    expect(inv1.equals(inv2)).toBe(false)
  })

  it('equals returns false for non-invitation', () => {
    const invitation = makeInvitation()
    expect(invitation.equals({} as Invitation)).toBe(false)
  })
})
