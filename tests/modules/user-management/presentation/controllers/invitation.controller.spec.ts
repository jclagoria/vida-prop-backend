import { of, throwError } from 'rxjs'
import type { AcceptInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/accept-invitation.usecase'
import type { CancelInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/cancel-invitation.usecase'
import type { CreateInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/create-invitation.usecase'
import type { GetAllInvitationsUseCase } from '@/modules/user-management/application/use-cases/invitation/get-all-invitations.usecase'
import type { GetInvitationByIdUseCase } from '@/modules/user-management/application/use-cases/invitation/get-invitation-by-id.usecase'
import type { ResendInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/resend-invitation.usecase'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'
import { InvitationController } from '@/modules/user-management/presentation/controllers/invitation.controller'

describe('InvitationController', () => {
  let controller: InvitationController

  const mockCreateUseCase = { execute: jest.fn() }
  const mockAcceptUseCase = { execute: jest.fn() }
  const mockCancelUseCase = { execute: jest.fn() }
  const mockResendUseCase = { execute: jest.fn() }
  const mockGetAllUseCase = { execute: jest.fn() }
  const mockGetByIdUseCase = { execute: jest.fn() }

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

  const makeCurrentUser = () => {
    return new User({
      id: new UserId('current-user-id'),
      email: new Email('current@habitat.com'),
      passwordHash: 'hashed',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()

    controller = new InvitationController(
      mockCreateUseCase as unknown as CreateInvitationUseCase,
      mockAcceptUseCase as unknown as AcceptInvitationUseCase,
      mockCancelUseCase as unknown as CancelInvitationUseCase,
      mockResendUseCase as unknown as ResendInvitationUseCase,
      mockGetAllUseCase as unknown as GetAllInvitationsUseCase,
      mockGetByIdUseCase as unknown as GetInvitationByIdUseCase
    )
  })

  describe('getAll', () => {
    it('should return paginated invitations', async () => {
      mockGetAllUseCase.execute.mockReturnValue(
        of({
          data: [makeInvitation()],
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        })
      )

      const result = await controller.getAll({ page: 1, limit: 20 })

      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
    })
  })

  describe('create', () => {
    it('should create invitation', async () => {
      const invitation = makeInvitation()
      mockCreateUseCase.execute.mockReturnValue(of(invitation))

      const currentUser = makeCurrentUser()
      const result = await controller.create(
        { email: 'new@habitat.com', role: UserRole.TENANT },
        currentUser
      )

      expect(result.email).toBe('new@habitat.com')
    })
  })

  describe('getById', () => {
    it('should return invitation by id', async () => {
      const invitation = makeInvitation()
      mockGetByIdUseCase.execute.mockReturnValue(of(invitation))

      const result = await controller.getById('invitation-id')

      expect(result.id).toBe('invitation-id')
    })
  })

  describe('cancel', () => {
    it('should cancel invitation', async () => {
      const invitation = makeInvitation()
      mockCancelUseCase.execute.mockReturnValue(of(invitation))

      const result = await controller.cancel('invitation-id')

      expect(result.id).toBe('invitation-id')
    })

    it('should throw error when cancellation fails', async () => {
      mockCancelUseCase.execute.mockReturnValue(throwError(() => new Error('Cancel failed')))

      await expect(controller.cancel('invalid-id')).rejects.toThrow(Error)
    })
  })

  describe('resend', () => {
    it('should resend invitation', async () => {
      const invitation = makeInvitation()
      mockResendUseCase.execute.mockReturnValue(of(invitation))

      const result = await controller.resend('invitation-id')

      expect(result.id).toBe('invitation-id')
    })

    it('should throw error when resend fails', async () => {
      mockResendUseCase.execute.mockReturnValue(throwError(() => new Error('Resend failed')))

      await expect(controller.resend('invalid-id')).rejects.toThrow(Error)
    })
  })

  describe('accept', () => {
    it('should accept invitation and return tokens', async () => {
      const user = makeCurrentUser()
      mockAcceptUseCase.execute.mockReturnValue(of(user))

      const result = await controller.accept('invitation-id', { password: 'password123' })

      expect(result.accessToken).toBeDefined()
    })

    it('should throw error when acceptance fails', async () => {
      mockAcceptUseCase.execute.mockReturnValue(throwError(() => new Error('Accept failed')))

      await expect(controller.accept('invalid-id', { password: 'password123' })).rejects.toThrow(
        Error
      )
    })
  })
})
