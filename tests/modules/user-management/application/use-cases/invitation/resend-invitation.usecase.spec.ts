import { of, throwError } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import { ResendInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/resend-invitation.usecase'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'

describe('ResendInvitationUseCase', () => {
  let useCase: ResendInvitationUseCase
  let mockInvitationService: IInvitationServicePort

  const makeInvitation = () => {
    return new Invitation({
      id: 'invitation-id',
      email: 'new@habitat.com',
      role: UserRole.TENANT,
      status: InvitationStatus.PENDING,
      token: 'new-test-token',
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

    useCase = new ResendInvitationUseCase(mockInvitationService)
  })

  describe('execute', () => {
    it('should resend invitation', (done) => {
      const invitation = makeInvitation()
      ;(mockInvitationService.resend as jest.Mock).mockReturnValue(of(invitation))

      useCase.execute('invitation-id').subscribe((result) => {
        expect(result).toBe(invitation)
        expect(mockInvitationService.resend).toHaveBeenCalledWith('invitation-id')
        done()
      })
    })

    it('should throw error when service fails', (done) => {
      ;(mockInvitationService.resend as jest.Mock).mockReturnValue(
        throwError(() => new Error('Invitation not found'))
      )

      useCase.execute('invalid-id').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invitation not found')
          done()
        },
      })
    })

    it('should throw error when invitation already accepted', (done) => {
      ;(mockInvitationService.resend as jest.Mock).mockReturnValue(
        throwError(() => new Error('Invitation already accepted'))
      )

      useCase.execute('accepted-invitation-id').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invitation already accepted')
          done()
        },
      })
    })
  })
})
