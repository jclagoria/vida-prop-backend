import { of, throwError } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import { GetInvitationByTokenUseCase } from '@/modules/user-management/application/use-cases/invitation/get-invitation-by-token.usecase'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'

describe('GetInvitationByTokenUseCase', () => {
  let useCase: GetInvitationByTokenUseCase
  let mockInvitationService: IInvitationServicePort

  const makeInvitation = () => {
    return new Invitation({
      id: 'invitation-id',
      email: 'new@habitat.com',
      role: UserRole.TENANT,
      status: InvitationStatus.PENDING,
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

    useCase = new GetInvitationByTokenUseCase(mockInvitationService)
  })

  describe('execute', () => {
    it('should return invitation by token', (done) => {
      const invitation = makeInvitation()
      ;(mockInvitationService.findByToken as jest.Mock).mockReturnValue(of(invitation))

      useCase.execute('test-token-123').subscribe((result) => {
        expect(result).toBe(invitation)
        expect(mockInvitationService.findByToken).toHaveBeenCalledWith('test-token-123')
        done()
      })
    })

    it('should throw error when invitation not found', (done) => {
      ;(mockInvitationService.findByToken as jest.Mock).mockReturnValue(of(null))

      useCase.execute('non-existent-token').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invitation not found')
          done()
        },
      })
    })

    it('should throw error when service fails', (done) => {
      ;(mockInvitationService.findByToken as jest.Mock).mockReturnValue(
        throwError(() => new Error('Database error'))
      )

      useCase.execute('test-token-123').subscribe({
        error: (error) => {
          expect(error.message).toContain('Database error')
          done()
        },
      })
    })
  })
})
