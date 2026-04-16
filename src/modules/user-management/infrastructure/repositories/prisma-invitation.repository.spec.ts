import { Test, type TestingModule } from '@nestjs/testing'
import { User } from '@/modules/user-management/domain/entities/user.entity.js'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'
import { PrismaInvitationRepository } from './prisma-invitation.repository'

const mockPrismaClient = {
  invitation: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
}

describe('PrismaInvitationRepository', () => {
  let repository: PrismaInvitationRepository

  beforeEach(() => {
    jest.clearAllMocks()
    repository = new PrismaInvitationRepository(mockPrismaClient as any)
  })

  describe('findById', () => {
    it.skip('should return invitation when found', (done) => {
      const prismaInvitation = {
        id: 'inv-123',
        email: 'test@example.com',
        role: 'TENANT',
        token: 'token-abc',
        status: 'PENDING',
        expiresAt: new Date('2025-12-31'),
        createdAt: new Date(),
        createdById: 'user-123',
        apartmentId: null,
        buildingId: null,
      }
      mockPrismaClient.invitation.findUnique.mockResolvedValue(prismaInvitation)

      repository.findById('inv-123').subscribe({
        next: (invitation) => {
          expect(invitation).not.toBeNull()
          expect(invitation?.email.value).toBe('test@example.com')
          done()
        },
        error: done.fail,
      })
    })

    it('should return null when not found', (done) => {
      mockPrismaClient.invitation.findUnique.mockResolvedValue(null)

      repository.findById('not-found').subscribe({
        next: (invitation) => {
          expect(invitation).toBeNull()
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('findByToken', () => {
    it.skip('should return invitation by token', (done) => {
      const prismaInvitation = {
        id: 'inv-123',
        email: 'test@example.com',
        role: 'TENANT',
        token: 'token-abc',
        status: 'PENDING',
        expiresAt: new Date('2025-12-31'),
        createdAt: new Date(),
        createdById: 'user-123',
        apartmentId: null,
        buildingId: null,
      }
      mockPrismaClient.invitation.findUnique.mockResolvedValue(prismaInvitation)

      repository.findByToken('token-abc').subscribe({
        next: (invitation) => {
          expect(invitation).not.toBeNull()
          expect(invitation?.token).toBe('token-abc')
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('findByEmail', () => {
    it.skip('should find by email with status', (done) => {
      const prismaInvitation = {
        id: 'inv-123',
        email: 'test@example.com',
        role: 'TENANT',
        token: 'token-abc',
        status: 'PENDING',
        expiresAt: new Date('2025-12-31'),
        createdAt: new Date(),
        createdById: 'user-123',
        apartmentId: null,
        buildingId: null,
      }
      mockPrismaClient.invitation.findFirst.mockResolvedValue(prismaInvitation)

      repository.findByEmail(Email.create('test@example.com'), InvitationStatus.PENDING).subscribe({
        next: (invitation) => {
          expect(invitation).not.toBeNull()
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('findByCreator', () => {
    it.skip('should return all invitations by creator', (done) => {
      const prismaInvitations = [
        {
          id: 'inv-1',
          email: 'user1@example.com',
          role: 'TENANT',
          token: 'token-1',
          status: 'PENDING',
          expiresAt: new Date('2025-12-31'),
          createdAt: new Date(),
          createdById: 'user-123',
        },
        {
          id: 'inv-2',
          email: 'user2@example.com',
          role: 'TENANT',
          token: 'token-2',
          status: 'PENDING',
          expiresAt: new Date('2025-12-31'),
          createdAt: new Date(),
          createdById: 'user-123',
        },
      ]
      mockPrismaClient.invitation.findMany.mockResolvedValue(prismaInvitations)

      repository.findByCreator(UserId.create('user-123')).subscribe({
        next: (invitations) => {
          expect(invitations).toHaveLength(2)
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('save', () => {
    it.skip('should create new invitation', (done) => {
      const { Invitation } = jest.requireActual(
        '@/modules/user-management/domain/entities/invitation.entity.js'
      )
      const invitation = Invitation.create({
        id: 'inv-new',
        email: Email.create('new@example.com'),
        role: UserRole.TENANT,
        token: 'new-token',
        status: InvitationStatus.PENDING,
        expiresAt: new Date('2025-12-31'),
        createdById: UserId.create('user-123'),
        createdAt: new Date(),
      })
      const prismaInvitation = {
        id: 'inv-new',
        email: 'new@example.com',
        role: 'TENANT',
        token: 'new-token',
        status: 'PENDING',
        expiresAt: new Date('2025-12-31'),
        createdAt: new Date(),
        createdById: 'user-123',
        apartmentId: null,
        buildingId: null,
      }
      mockPrismaClient.invitation.create.mockResolvedValue(prismaInvitation)

      repository.save(invitation as any).subscribe({
        next: (saved) => {
          expect(saved).not.toBeNull()
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('update', () => {
    it.skip('should update invitation status', (done) => {
      const prismaInvitation = {
        id: 'inv-123',
        email: 'test@example.com',
        role: 'TENANT',
        token: 'token-abc',
        status: 'ACCEPTED',
        expiresAt: new Date('2025-12-31'),
        createdAt: new Date(),
        createdById: 'user-123',
        apartmentId: null,
        buildingId: null,
      }
      mockPrismaClient.invitation.update.mockResolvedValue(prismaInvitation)

      repository.update({ ...prismaInvitation, status: 'ACCEPTED' } as any).subscribe({
        next: () => {
          expect(mockPrismaClient.invitation.update).toHaveBeenCalled()
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('delete', () => {
    it.skip('should delete invitation by id', (done) => {
      mockPrismaClient.invitation.delete.mockResolvedValue({ id: 'inv-123' })

      repository.delete('inv-123').subscribe({
        next: () => {
          expect(mockPrismaClient.invitation.delete).toHaveBeenCalledWith({
            where: { id: 'inv-123' },
          })
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('deleteExpired', () => {
    it.skip('should delete expired invitations', (done) => {
      mockPrismaClient.invitation.updateMany.mockResolvedValue({ count: 5 })

      repository.deleteExpired().subscribe({
        next: (count) => {
          expect(count).toBe(5)
          done()
        },
        error: done.fail,
      })
    })
  })
})
