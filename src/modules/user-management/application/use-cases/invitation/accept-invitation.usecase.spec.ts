import { of, throwError } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service.js'
import { AcceptInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/accept-invitation.usecase.js'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity.js'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('AcceptInvitationUseCase', () => {
  let invitationService: jest.Mocked<IInvitationServicePort>
  let useCase: AcceptInvitationUseCase

  beforeEach(() => {
    invitationService = {
      createInvitation: jest.fn(),
      acceptInvitation: jest.fn(),
      cancelInvitation: jest.fn(),
      resendInvitation: jest.fn(),
      getInvitationByToken: jest.fn(),
      getInvitationById: jest.fn(),
    }
    useCase = new AcceptInvitationUseCase(invitationService)
  })

  describe('execute', () => {
    it('should throw if token is missing', (done) => {
      useCase.execute('', 'password123').subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Token and password are required')
          done()
        },
      })
    })

    it('should throw if password is missing', (done) => {
      useCase.execute('token-123', '').subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Token and password are required')
          done()
        },
      })
    })

    it('should return result on success', (done) => {
      const invitation = Invitation.create({
        id: 'inv-123',
        email: Email.create('test@example.com'),
        role: UserRole.TENANT,
        token: 'token-123',
        status: InvitationStatus.ACCEPTED,
        expiresAt: new Date(),
        createdById: UserId.generate(),
        createdAt: new Date(),
      })

      invitationService.acceptInvitation.mockReturnValue(of(invitation))

      useCase.execute('token-123', 'password123').subscribe({
        next: (result) => {
          expect(result.invitationId).toBe('inv-123')
          expect(result.email).toBe('test@example.com')
          expect(result.status).toBe('ACCEPTED')
          done()
        },
        error: done.fail,
      })
    })
  })
})
