import { of, throwError } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import { GetInvitationByIdUseCase } from '@/modules/user-management/application/use-cases/invitation/get-invitation-by-id.usecase'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'

describe('GetInvitationByIdUseCase', () => {
  let useCase: GetInvitationByIdUseCase
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

    useCase = new GetInvitationByIdUseCase(mockInvitationService)
  })

  describe('execute', () => {
    it('should return invitation by id', (done) => {
      const invitation = makeInvitation()
      ;(mockInvitationService.findById as jest.Mock).mockReturnValue(of(invitation))

      useCase.execute('invitation-id').subscribe((result) => {
        expect(result).toBe(invitation)
        expect(mockInvitationService.findById).toHaveBeenCalledWith('invitation-id')
        done()
      })
    })

    it('should throw error when invitation not found', (done) => {
      ;(mockInvitationService.findById as jest.Mock).mockReturnValue(of(null))

      useCase.execute('non-existent-id').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invitation not found')
          done()
        },
      })
    })

    it('should throw error when service fails', (done) => {
      ;(mockInvitationService.findById as jest.Mock).mockReturnValue(
        throwError(() => new Error('Database error'))
      )

      useCase.execute('invitation-id').subscribe({
        error: (error) => {
          expect(error.message).toContain('Database error')
          done()
        },
      })
    })
  })
})
