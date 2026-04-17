import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { EmailService } from '@/modules/user-management/infrastructure/services/email.service'

describe('EmailService', () => {
  let service: EmailService

  const makeInvitation = () => {
    return new Invitation({
      id: 'invitation-id',
      email: 'new@habitat.com',
      role: UserRole.TENANT,
      status: InvitationStatus.PENDING,
      token: 'test-token',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdById: 'creator-id',
      createdAt: new Date(),
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    service = new EmailService()
  })

  describe('sendInvitationEmail', () => {
    it('should log invitation email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      const invitation = makeInvitation()
      await service.sendInvitationEmail(invitation, 'John Doe')

      expect(consoleSpy).toHaveBeenCalledWith('[Email] To: new@habitat.com')
      expect(consoleSpy).toHaveBeenCalledWith('[Email] Subject: You have been invited to Habitat')
      expect(consoleSpy).toHaveBeenCalledWith('[Email] Role: TENANT')

      consoleSpy.mockRestore()
    })
  })

  describe('sendPasswordResetEmail', () => {
    it('should log password reset email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      await service.sendPasswordResetEmail('user@habitat.com', 'reset-token')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Sending password reset email to user@habitat.com with token reset-token'
      )

      consoleSpy.mockRestore()
    })
  })
})
