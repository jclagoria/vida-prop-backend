import { of, throwError } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service.js'
import { ResendInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/resend-invitation.usecase.js'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity.js'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('ResendInvitationUseCase', () => {
  let invitationService: jest.Mocked<IInvitationServicePort>
  let useCase: ResendInvitationUseCase

  beforeEach(() => {
    invitationService = {
      createInvitation: jest.fn(),
      acceptInvitation: jest.fn(),
      cancelInvitation: jest.fn(),
      resendInvitation: jest.fn(),
      getInvitationByToken: jest.fn(),
      getInvitationById: jest.fn(),
    }
    useCase = new ResendInvitationUseCase(invitationService)
  })

  describe('execute', () => {
    it('should throw if invitationId is missing', (done) => {
      useCase.execute('').subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Invitation ID is required')
          done()
        },
      })
    })

    it('should return result on success', (done) => {
      const newExpiresAt = new Date()
      newExpiresAt.setDate(newExpiresAt.getDate() + 7)

      const invitation = Invitation.create({
        id: 'inv-123',
        email: Email.create('test@example.com'),
        role: UserRole.TENANT,
        token: 'new-token-123',
        status: InvitationStatus.PENDING,
        expiresAt: newExpiresAt,
        createdById: UserId.generate(),
        createdAt: new Date(),
      })

      invitationService.resendInvitation.mockReturnValue(of(invitation))

      useCase.execute('inv-123').subscribe({
        next: (result) => {
          expect(result.invitationId).toBe('inv-123')
          expect(result.expiresAt).toEqual(newExpiresAt)
          done()
        },
        error: done.fail,
      })
    })
  })
})
