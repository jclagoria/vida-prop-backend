import { of, throwError } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service.js'
import { CreateInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/create-invitation.usecase.js'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity.js'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('CreateInvitationUseCase', () => {
  let invitationService: jest.Mocked<IInvitationServicePort>
  let useCase: CreateInvitationUseCase

  beforeEach(() => {
    invitationService = {
      createInvitation: jest.fn(),
      acceptInvitation: jest.fn(),
      cancelInvitation: jest.fn(),
      resendInvitation: jest.fn(),
      getInvitationByToken: jest.fn(),
      getInvitationById: jest.fn(),
    }
    useCase = new CreateInvitationUseCase(invitationService)
  })

  describe('execute', () => {
    it('should throw if email is missing', (done) => {
      useCase.execute({ email: '', role: 'TENANT' }, 'creator-123').subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Email, role, and creator ID are required')
          done()
        },
      })
    })

    it('should throw if role is missing', (done) => {
      useCase.execute({ email: 'test@example.com', role: '' }, 'creator-123').subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Email, role, and creator ID are required')
          done()
        },
      })
    })

    it('should throw if createdById is missing', (done) => {
      useCase.execute({ email: 'test@example.com', role: 'TENANT' }, '').subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Email, role, and creator ID are required')
          done()
        },
      })
    })

    it('should throw if role is invalid', (done) => {
      useCase
        .execute({ email: 'test@example.com', role: 'INVALID_ROLE' }, 'creator-123')
        .subscribe({
          next: () => done.fail('Should have thrown'),
          error: (err) => {
            expect(err.message).toBe('Invalid role')
            done()
          },
        })
    })

    it('should return result on success', (done) => {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const invitation = Invitation.create({
        id: 'inv-123',
        email: Email.create('test@example.com'),
        role: UserRole.TENANT,
        token: 'token-123',
        status: InvitationStatus.PENDING,
        expiresAt,
        createdById: UserId.generate(),
        createdAt: new Date(),
      })

      invitationService.createInvitation.mockReturnValue(of(invitation))

      useCase
        .execute(
          { email: 'test@example.com', role: 'TENANT' },
          '123e4567-e89b-12d3-a456-426614174000'
        )
        .subscribe({
          next: (result) => {
            expect(result.invitationId).toBe('inv-123')
            expect(result.email).toBe('test@example.com')
            expect(result.role).toBe('TENANT')
            done()
          },
          error: done.fail,
        })
    })
  })
})
