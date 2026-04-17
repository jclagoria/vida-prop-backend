import { of, throwError } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import { AcceptInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/accept-invitation.usecase'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('AcceptInvitationUseCase', () => {
  let useCase: AcceptInvitationUseCase
  let mockInvitationService: IInvitationServicePort

  const makeUser = () => {
    return new User({
      id: new UserId('new-user-id'),
      email: new Email('new@habitat.com'),
      passwordHash: 'hashed',
      role: UserRole.TENANT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
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

    useCase = new AcceptInvitationUseCase(mockInvitationService)
  })

  describe('execute', () => {
    it('should accept invitation and return user', (done) => {
      const user = makeUser()
      ;(mockInvitationService.accept as jest.Mock).mockReturnValue(of(user))

      useCase.execute('valid-token', 'password123').subscribe((result) => {
        expect(result).toBe(user)
        expect(mockInvitationService.accept).toHaveBeenCalledWith('valid-token', 'password123')
        done()
      })
    })

    it('should throw error when service fails', (done) => {
      ;(mockInvitationService.accept as jest.Mock).mockReturnValue(
        throwError(() => new Error('Invalid token'))
      )

      useCase.execute('invalid-token', 'password123').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invalid token')
          done()
        },
      })
    })

    it('should propagate error when invitation expired', (done) => {
      ;(mockInvitationService.accept as jest.Mock).mockReturnValue(
        throwError(() => new Error('Invitation expired'))
      )

      useCase.execute('expired-token', 'password123').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invitation expired')
          done()
        },
      })
    })

    it('should propagate error when invitation already accepted', (done) => {
      ;(mockInvitationService.accept as jest.Mock).mockReturnValue(
        throwError(() => new Error('Invitation already accepted'))
      )

      useCase.execute('accepted-token', 'password123').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invitation already accepted')
          done()
        },
      })
    })

    it('should handle non-Error thrown object', (done) => {
      ;(mockInvitationService.accept as jest.Mock).mockReturnValue(throwError(() => 'string error'))

      useCase.execute('token', 'password').subscribe({
        error: (error) => {
          expect(error).toBe('string error')
          done()
        },
      })
    })
  })
})
