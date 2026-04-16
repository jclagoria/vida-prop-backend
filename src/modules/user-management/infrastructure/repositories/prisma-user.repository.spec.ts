import { Test, type TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'
import { User } from '@/modules/user-management/domain/entities/user.entity.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'
import { PrismaUserRepository } from './prisma-user.repository'

const mockPrismaClient = {
  users: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
}

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository

  beforeEach(() => {
    jest.clearAllMocks()
    repository = new PrismaUserRepository(mockPrismaClient as any)
  })

  describe('findById', () => {
    it('should return user when found', (done) => {
      const userId = UserId.create('123e4567-e89b-12d3-a456-426614174000')
      const prismaUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockPrismaClient.users.findUnique.mockResolvedValue(prismaUser)

      repository.findById(userId).subscribe({
        next: (user) => {
          expect(user).toBeInstanceOf(User)
          expect(user?.email.value).toBe('test@example.com')
          done()
        },
        error: done.fail,
      })
    })

    it('should return null when user not found', (done) => {
      const userId = UserId.create('123e4567-e89b-12d3-a456-426614174000')
      mockPrismaClient.users.findUnique.mockResolvedValue(null)

      repository.findById(userId).subscribe({
        next: (user) => {
          expect(user).toBeNull()
          done()
        },
        error: done.fail,
      })
    })

    it('should throw on database error', (done) => {
      const userId = UserId.create('123e4567-e89b-12d3-a456-426614174000')
      mockPrismaClient.users.findUnique.mockRejectedValue(new Error('DB error'))

      repository.findById(userId).subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('DB error')
          done()
        },
      })
    })
  })

  describe('findByEmail', () => {
    it('should return user when found', (done) => {
      const email = Email.create('test@example.com')
      const prismaUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockPrismaClient.users.findUnique.mockResolvedValue(prismaUser)

      repository.findByEmail(email).subscribe({
        next: (user) => {
          expect(user).toBeInstanceOf(User)
          expect(user?.email.value).toBe('test@example.com')
          done()
        },
        error: done.fail,
      })
    })

    it('should return null when not found', (done) => {
      const email = Email.create('notfound@example.com')
      mockPrismaClient.users.findUnique.mockResolvedValue(null)

      repository.findByEmail(email).subscribe({
        next: (user) => {
          expect(user).toBeNull()
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('save', () => {
    it('should create new user', (done) => {
      const user = User.create({
        id: UserId.generate(),
        email: Email.create('new@example.com'),
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      const prismaUser = {
        id: user.id.value,
        email: user.email.value,
        passwordHash: user.passwordHash,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
      mockPrismaClient.users.create.mockResolvedValue(prismaUser)

      repository.save(user).subscribe({
        next: (saved) => {
          expect(saved).toBeInstanceOf(User)
          expect(mockPrismaClient.users.create).toHaveBeenCalledWith(
            expect.objectContaining({
              data: expect.objectContaining({
                email: user.email.value,
              }),
            })
          )
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('update', () => {
    it('should update existing user', (done) => {
      const user = User.create({
        id: UserId.create('123e4567-e89b-12d3-a456-426614174000'),
        email: Email.create('updated@example.com'),
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      const prismaUser = {
        id: user.id.value,
        email: user.email.value,
        passwordHash: user.passwordHash,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: new Date(),
      }
      mockPrismaClient.users.update.mockResolvedValue(prismaUser)

      repository.update(user).subscribe({
        next: (updated) => {
          expect(updated).toBeInstanceOf(User)
          expect(mockPrismaClient.users.update).toHaveBeenCalledWith(
            expect.objectContaining({
              where: { id: user.id.value },
              data: expect.objectContaining({
                isActive: false,
              }),
            })
          )
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('delete', () => {
    it('should delete user by id', (done) => {
      const userId = UserId.create('123e4567-e89b-12d3-a456-426614174000')
      mockPrismaClient.users.delete.mockResolvedValue({ id: userId.value })

      repository.delete(userId).subscribe({
        next: () => {
          expect(mockPrismaClient.users.delete).toHaveBeenCalledWith({
            where: { id: userId.value },
          })
          done()
        },
        error: done.fail,
      })
    })
  })

  describe('findAll', () => {
    it('should return all users', (done) => {
      const prismaUsers = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user1@example.com',
          passwordHash: 'hash1',
          role: 'ADMIN',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          email: 'user2@example.com',
          passwordHash: 'hash2',
          role: 'TENANT',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      mockPrismaClient.users.findMany.mockResolvedValue(prismaUsers)

      repository.findAll().subscribe({
        next: (users) => {
          expect(users).toHaveLength(2)
          expect(users[0]).toBeInstanceOf(User)
          expect(users[1]).toBeInstanceOf(User)
          done()
        },
        error: done.fail,
      })
    })
  })
})
