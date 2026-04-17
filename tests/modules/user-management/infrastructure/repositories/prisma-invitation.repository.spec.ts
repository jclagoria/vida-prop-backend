import { of } from 'rxjs'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { PrismaInvitationRepository } from '@/modules/user-management/infrastructure/repositories/prisma-invitation.repository'

describe('PrismaInvitationRepository', () => {
  let repository: PrismaInvitationRepository
  let mockPrisma: any

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

  beforeEach(() => {
    mockPrisma = {
      invitation: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
      },
    }

    repository = new PrismaInvitationRepository(mockPrisma)
  })

  describe('findById', () => {
    it('should return invitation when found', (done) => {
      mockPrisma.invitation.findUnique.mockResolvedValue({
        id: 'invitation-id',
        email: 'new@habitat.com',
        role: 'TENANT',
        status: 'PENDING',
        token: 'test-token',
        expiresAt: new Date(),
        createdById: 'creator-id',
        createdAt: new Date(),
      })

      repository.findById('invitation-id').subscribe((invitation) => {
        expect(invitation).not.toBeNull()
        expect(invitation?.id).toBe('invitation-id')
        done()
      })
    })

    it('should return null when not found', (done) => {
      mockPrisma.invitation.findUnique.mockResolvedValue(null)

      repository.findById('non-existent').subscribe((invitation) => {
        expect(invitation).toBeNull()
        done()
      })
    })
  })

  describe('findByToken', () => {
    it('should return invitation by token', (done) => {
      mockPrisma.invitation.findUnique.mockResolvedValue({
        id: 'invitation-id',
        email: 'new@habitat.com',
        role: 'TENANT',
        status: 'PENDING',
        token: 'test-token',
        expiresAt: new Date(),
        createdById: 'creator-id',
        createdAt: new Date(),
      })

      repository.findByToken('test-token').subscribe((invitation) => {
        expect(invitation).not.toBeNull()
        done()
      })
    })
  })

  describe('findByEmail', () => {
    it('should return invitation by email', (done) => {
      mockPrisma.invitation.findFirst.mockResolvedValue({
        id: 'invitation-id',
        email: 'new@habitat.com',
        role: 'TENANT',
        status: 'PENDING',
        token: 'test-token',
        expiresAt: new Date(),
        createdById: 'creator-id',
        createdAt: new Date(),
      })

      repository.findByEmail('new@habitat.com').subscribe((invitation) => {
        expect(invitation).not.toBeNull()
        done()
      })
    })
  })

  describe('save', () => {
    it('should create invitation', (done) => {
      mockPrisma.invitation.create.mockResolvedValue({
        id: 'new-invitation-id',
        email: 'new@habitat.com',
        role: 'TENANT',
        status: 'PENDING',
        token: 'new-token',
        expiresAt: new Date(),
        createdById: 'creator-id',
        createdAt: new Date(),
      })

      const invitation = new Invitation({
        id: 'new-invitation-id',
        email: 'new@habitat.com',
        role: UserRole.TENANT,
        status: InvitationStatus.PENDING,
        token: 'new-token',
        expiresAt: new Date(),
        createdById: 'creator-id',
        createdAt: new Date(),
      })

      repository.save(invitation).subscribe((result) => {
        expect(result).not.toBeNull()
        expect(mockPrisma.invitation.create).toHaveBeenCalled()
        done()
      })
    })
  })

  describe('update', () => {
    it('should update invitation', (done) => {
      mockPrisma.invitation.update.mockResolvedValue({
        id: 'invitation-id',
        email: 'new@habitat.com',
        role: 'TENANT',
        status: 'ACCEPTED',
        token: 'test-token',
        expiresAt: new Date(),
        createdById: 'creator-id',
        createdAt: new Date(),
      })

      const invitation = makeInvitation()

      repository.update(invitation).subscribe((result) => {
        expect(result).not.toBeNull()
        expect(mockPrisma.invitation.update).toHaveBeenCalled()
        done()
      })
    })
  })

  describe('delete', () => {
    it('should delete invitation', (done) => {
      mockPrisma.invitation.delete.mockResolvedValue({})

      repository.delete('invitation-id').subscribe((result) => {
        expect(result).toBeUndefined()
        expect(mockPrisma.invitation.delete).toHaveBeenCalled()
        done()
      })
    })
  })

  describe('findMany', () => {
    it('should return paginated invitations', (done) => {
      const mockPrismaData = {
        invitation: {
          findMany: jest.fn().mockResolvedValue([
            {
              id: 'invitation-id',
              email: 'new@habitat.com',
              role: 'TENANT',
              status: 'PENDING',
              token: 'test-token',
              expiresAt: new Date(),
              createdById: 'creator-id',
              createdAt: new Date(),
            },
          ]),
          count: jest.fn().mockResolvedValue(1),
        },
      }
      const testRepo = new PrismaInvitationRepository(mockPrismaData)

      testRepo.findMany({ page: 1, limit: 20 }).subscribe((result) => {
        expect(result.data).toHaveLength(1)
        expect(result.total).toBe(1)
        done()
      })
    })

    it('should filter by status', (done) => {
      const mockPrismaData = {
        invitation: {
          findMany: jest.fn().mockResolvedValue([]),
          count: jest.fn().mockResolvedValue(0),
        },
      }
      const testRepo = new PrismaInvitationRepository(mockPrismaData)

      testRepo.findMany({ page: 1, limit: 20, status: 'PENDING' }).subscribe((result) => {
        expect(result.total).toBe(0)
        done()
      })
    })
  })

  describe('updateManyExpired', () => {
    it('should update expired invitations', (done) => {
      mockPrisma.invitation.updateMany.mockResolvedValue({ count: 5 })

      repository.updateManyExpired().subscribe((result) => {
        expect(result.count).toBe(5)
        done()
      })
    })
  })
})
