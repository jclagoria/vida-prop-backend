import { of } from 'rxjs'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'
import { PrismaUserRepository } from '@/modules/user-management/infrastructure/repositories/prisma-user.repository'

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository
  let mockPrisma: any

  const _makeUser = () => {
    return new User({
      id: new UserId('user-id'),
      email: new Email('user@habitat.com'),
      passwordHash: 'hashed_password',
      role: UserRole.TENANT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    }

    repository = new PrismaUserRepository(mockPrisma)
  })

  describe('findById', () => {
    it('should return user when found', (done) => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'user@habitat.com',
        passwordHash: 'hashed',
        role: 'TENANT',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.findById(new UserId('user-id')).subscribe((user) => {
        expect(user).not.toBeNull()
        expect(user?.id.toString()).toBe('user-id')
        done()
      })
    })

    it('should return null when not found', (done) => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      repository.findById(new UserId('non-existent')).subscribe((user) => {
        expect(user).toBeNull()
        done()
      })
    })
  })

  describe('findByEmail', () => {
    it('should return user when found', (done) => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'user@habitat.com',
        passwordHash: 'hashed',
        role: 'TENANT',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.findByEmail(new Email('user@habitat.com')).subscribe((user) => {
        expect(user).not.toBeNull()
        done()
      })
    })
  })

  describe('save', () => {
    it('should create and return user', (done) => {
      mockPrisma.user.create.mockResolvedValue({
        id: 'new-user-id',
        email: 'new@habitat.com',
        passwordHash: 'hashed',
        role: 'TENANT',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const user = new User({
        id: new UserId('new-user-id'),
        email: new Email('new@habitat.com'),
        passwordHash: 'hashed',
        role: UserRole.TENANT,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.save(user).subscribe((result) => {
        expect(result).not.toBeNull()
        expect(mockPrisma.user.create).toHaveBeenCalled()
        done()
      })
    })
  })

  describe('update', () => {
    it('should update and return user', (done) => {
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-id',
        email: 'updated@habitat.com',
        passwordHash: 'hashed',
        role: 'TENANT',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const user = new User({
        id: new UserId('user-id'),
        email: new Email('updated@habitat.com'),
        passwordHash: 'hashed',
        role: UserRole.TENANT,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.update(user).subscribe((result) => {
        expect(result).not.toBeNull()
        expect(mockPrisma.user.update).toHaveBeenCalled()
        done()
      })
    })

    it('should update role', (done) => {
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-id',
        email: 'user@habitat.com',
        passwordHash: 'hashed',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const user = new User({
        id: new UserId('user-id'),
        email: new Email('user@habitat.com'),
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.update(user).subscribe((result) => {
        expect(result.role).toBe(UserRole.ADMIN)
        done()
      })
    })

    it('should deactivate user', (done) => {
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-id',
        email: 'user@habitat.com',
        passwordHash: 'hashed',
        role: 'TENANT',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const user = new User({
        id: new UserId('user-id'),
        email: new Email('user@habitat.com'),
        passwordHash: 'hashed',
        role: UserRole.TENANT,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.update(user).subscribe((result) => {
        expect(result.isActiveUser()).toBe(false)
        done()
      })
    })
  })

  describe('delete', () => {
    it('should delete user', (done) => {
      mockPrisma.user.delete.mockResolvedValue({})

      repository.delete(new UserId('user-id')).subscribe((result) => {
        expect(result).toBeUndefined()
        expect(mockPrisma.user.delete).toHaveBeenCalled()
        done()
      })
    })
  })
})
