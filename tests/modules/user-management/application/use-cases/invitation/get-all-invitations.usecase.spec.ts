import { of } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import { GetAllInvitationsUseCase } from '@/modules/user-management/application/use-cases/invitation/get-all-invitations.usecase'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'

describe('GetAllInvitationsUseCase', () => {
  let useCase: GetAllInvitationsUseCase
  let mockInvitationService: IInvitationServicePort

  const makeInvitation = (id: string) => {
    return new Invitation({
      id,
      email: `${id}@habitat.com`,
      role: UserRole.TENANT,
      status: InvitationStatus.PENDING,
      token: `token-${id}`,
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

    useCase = new GetAllInvitationsUseCase(mockInvitationService)
  })

  describe('execute', () => {
    it('should return paginated invitations', (done) => {
      const result = {
        data: [makeInvitation('1'), makeInvitation('2')],
        total: 2,
        page: 1,
        limit: 20,
      }
      ;(mockInvitationService.findMany as jest.Mock).mockReturnValue(of(result))

      useCase.execute({ page: 1, limit: 20 }).subscribe((response) => {
        expect(response.data).toHaveLength(2)
        expect(mockInvitationService.findMany).toHaveBeenCalledWith({
          page: 1,
          limit: 20,
          status: undefined,
        })
        done()
      })
    })

    it('should use default pagination values', (done) => {
      const result = { data: [], total: 0, page: 1, limit: 20 }
      ;(mockInvitationService.findMany as jest.Mock).mockReturnValue(of(result))

      useCase.execute({ page: 0, limit: 0 }).subscribe(() => {
        expect(mockInvitationService.findMany).toHaveBeenCalledWith({
          page: 1,
          limit: 20,
          status: undefined,
        })
        done()
      })
    })

    it('should cap limit at 100', (done) => {
      const result = { data: [], total: 0, page: 1, limit: 100 }
      ;(mockInvitationService.findMany as jest.Mock).mockReturnValue(of(result))

      useCase.execute({ page: 1, limit: 500 }).subscribe(() => {
        expect(mockInvitationService.findMany).toHaveBeenCalledWith({
          page: 1,
          limit: 100,
          status: undefined,
        })
        done()
      })
    })

    it('should filter by status when provided', (done) => {
      const result = { data: [makeInvitation('1')], total: 1, page: 1, limit: 20 }
      ;(mockInvitationService.findMany as jest.Mock).mockReturnValue(of(result))

      useCase.execute({ page: 1, limit: 20, status: 'PENDING' }).subscribe(() => {
        expect(mockInvitationService.findMany).toHaveBeenCalledWith({
          page: 1,
          limit: 20,
          status: 'PENDING',
        })
        done()
      })
    })
  })
})
