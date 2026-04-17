import { of, throwError } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import { CreateInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/create-invitation.usecase'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import type { InvitationDomainService } from '@/modules/user-management/domain/services/invitation.domain-service'

describe('CreateInvitationUseCase', () => {
  let useCase: CreateInvitationUseCase
  let mockInvitationService: IInvitationServicePort
  let mockDomainService: InvitationDomainService

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

    mockDomainService = {
      validateInvitationCreation: jest.fn(),
    } as never

    useCase = new CreateInvitationUseCase(mockInvitationService, mockDomainService)
  })

  describe('execute', () => {
    it('should create invitation with valid input', (done) => {
      const invitation = makeInvitation()
      ;(mockDomainService.validateInvitationCreation as jest.Mock).mockReturnValue({
        valid: true,
        errors: [],
      })
      ;(mockInvitationService.create as jest.Mock).mockReturnValue(of(invitation))

      const dto = {
        email: 'new@habitat.com',
        role: UserRole.TENANT,
      }

      useCase.execute(dto, 'creator-id').subscribe((result) => {
        expect(result).toBe(invitation)
        expect(mockInvitationService.create).toHaveBeenCalledWith(dto, 'creator-id')
        done()
      })
    })

    it('should throw error when validation fails', (done) => {
      ;(mockDomainService.validateInvitationCreation as jest.Mock).mockReturnValue({
        valid: false,
        errors: ['Invalid email format'],
      })

      const dto = {
        email: 'invalid-email',
        role: UserRole.TENANT,
      }

      useCase.execute(dto, 'creator-id').subscribe({
        error: (error) => {
          expect(error.message).toContain('Invalid email format')
          done()
        },
      })
    })

    it('should throw error when service fails', (done) => {
      ;(mockDomainService.validateInvitationCreation as jest.Mock).mockReturnValue({
        valid: true,
        errors: [],
      })
      ;(mockInvitationService.create as jest.Mock).mockReturnValue(
        throwError(() => new Error('Database error'))
      )

      const dto = {
        email: 'new@habitat.com',
        role: UserRole.TENANT,
      }

      useCase.execute(dto, 'creator-id').subscribe({
        error: (error) => {
          expect(error.message).toBe('Database error')
          done()
        },
      })
    })

    it('should include apartmentId and buildingId in validation', (done) => {
      const invitation = makeInvitation()
      ;(mockDomainService.validateInvitationCreation as jest.Mock).mockReturnValue({
        valid: true,
        errors: [],
      })
      ;(mockInvitationService.create as jest.Mock).mockReturnValue(of(invitation))

      const dto = {
        email: 'new@habitat.com',
        role: UserRole.TENANT,
        apartmentId: 'apt-1',
        buildingId: 'bld-1',
      }

      useCase.execute(dto, 'creator-id').subscribe((result) => {
        expect(result).toBe(invitation)
        expect(mockDomainService.validateInvitationCreation).toHaveBeenCalledWith({
          email: 'new@habitat.com',
          role: UserRole.TENANT,
          createdById: 'creator-id',
          apartmentId: 'apt-1',
          buildingId: 'bld-1',
        })
        done()
      })
    })
  })
})
