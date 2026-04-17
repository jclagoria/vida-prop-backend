import { of, throwError } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import { CancelInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/cancel-invitation.usecase'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'

describe('CancelInvitationUseCase', () => {
  let useCase: CancelInvitationUseCase
  let mockInvitationService: IInvitationServicePort

  const makeInvitation = () => {
    return new Invitation({
      id: 'invitation-id',
      email: 'new@habitat.com',
      role: UserRole.TENANT,
      status: InvitationStatus.CANCELLED,
      token: 'test-token-123',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdById: 'creator-id',
      createdAt: new Date(),
    })
  }

  beforeEach(() => {
    mockInvitationService = {
      create: jest.fn(),
      accept: jest.fn(),
      cancel: jest.fn(),
      resend: jest.fn(),
      findById: jest.fn(),
      findByToken: jest.fn(),
      findMany: jest.fn(),
    } as never

    useCase = new CancelInvitationUseCase(mockInvitationService)
  })

  describe('execute', () => {
    it('should cancel invitation', (done) => {
      const invitation = makeInvitation()
      ;(mockInvitationService.cancel as jest.Mock).mockReturnValue(of(invitation))

      useCase.execute('invitation-id').subscribe((result) => {
        expect(result).toBe(invitation)
        expect(mockInvitationService.cancel).toHaveBeenCalledWith('invitation-id')
        done()
      })
    })

    it('should throw error when service fails', (done) => {
      ;(mockInvitationService.cancel as jest.Mock).mockReturnValue(
        throwError(() => new Error('Invitation not found'))
      )

      useCase.execute('invalid-id').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invitation not found')
          done()
        },
      })
    })

    it('should handle non-Error thrown object', (done) => {
      ;(mockInvitationService.cancel as jest.Mock).mockReturnValue(throwError(() => 'string error'))

      useCase.execute('id').subscribe({
        error: (error) => {
          expect(error).toBe('string error')
          done()
        },
      })
    })
  })
})
