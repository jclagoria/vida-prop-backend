import { of, throwError } from 'rxjs'
import type { CreateUserUseCase } from '@/modules/user-management/application/use-cases/user/create-user.usecase'
import type { DeactivateUserUseCase } from '@/modules/user-management/application/use-cases/user/deactivate-user.usecase'
import type { GetUserByIdUseCase } from '@/modules/user-management/application/use-cases/user/get-user-by-id.usecase'
import type { UpdateUserUseCase } from '@/modules/user-management/application/use-cases/user/update-user.usecase'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'
import { UserController } from '@/modules/user-management/presentation/controllers/user.controller'

describe('UserController', () => {
  let controller: UserController

  const mockCreateUseCase = { execute: jest.fn() }
  const mockUpdateUseCase = { execute: jest.fn() }
  const mockDeactivateUseCase = { execute: jest.fn() }
  const mockGetByIdUseCase = { execute: jest.fn() }

  const makeUser = (props?: { isActive?: boolean; role?: UserRole }) => {
    return new User({
      id: new UserId('user-id'),
      email: new Email('user@habitat.com'),
      passwordHash: 'hashed',
      role: props?.role ?? UserRole.TENANT,
      isActive: props?.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()

    controller = new UserController(
      mockCreateUseCase as unknown as CreateUserUseCase,
      mockUpdateUseCase as unknown as UpdateUserUseCase,
      mockDeactivateUseCase as unknown as DeactivateUserUseCase,
      mockGetByIdUseCase as unknown as GetUserByIdUseCase
    )
  })

  describe('getAll', () => {
    it('should return empty list', async () => {
      const result = await controller.getAll({ page: 1, limit: 20 })

      expect(result.data).toHaveLength(0)
      expect(result.total).toBe(0)
    })
  })

  describe('create', () => {
    it('should create user', async () => {
      const user = makeUser()
      mockCreateUseCase.execute.mockReturnValue(of(user))

      const result = await controller.create({
        email: 'new@habitat.com',
        password: 'password123',
        role: UserRole.TENANT,
      })

      expect(result.email).toBe('user@habitat.com')
    })

    it('should throw error on validation failure', async () => {
      mockCreateUseCase.execute.mockReturnValue(throwError(() => new Error('Invalid email')))

      await expect(
        controller.create({ email: 'invalid', password: 'pass', role: UserRole.TENANT })
      ).rejects.toThrow(Error)
    })
  })

  describe('getById', () => {
    it('should return user by id', async () => {
      const user = makeUser()
      mockGetByIdUseCase.execute.mockReturnValue(of(user))

      const result = await controller.getById('user-id')

      expect(result.id).toBe('user-id')
    })

    it('should throw error for non-existent user', async () => {
      mockGetByIdUseCase.execute.mockReturnValue(of(null))

      await expect(controller.getById('non-existent')).rejects.toThrow(Error)
    })
  })

  describe('update', () => {
    it('should update user', async () => {
      const user = new User({
        id: new UserId('user-id'),
        email: new Email('updated@habitat.com'),
        passwordHash: 'hashed',
        role: UserRole.TENANT,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      mockUpdateUseCase.execute.mockReturnValue(of(user))

      const result = await controller.update('user-id', { email: 'updated@habitat.com' } as any)

      expect(result.email).toBe('updated@habitat.com')
    })

    it('should throw error on failure', async () => {
      mockUpdateUseCase.execute.mockReturnValue(throwError(() => new Error('User not found')))

      await expect(controller.update('user-id', {} as any)).rejects.toThrow(Error)
    })
  })

  describe('deactivate', () => {
    it('should deactivate user', async () => {
      const user = makeUser({ isActive: false })
      mockDeactivateUseCase.execute.mockReturnValue(of(user))

      const result = await controller.deactivate('user-id')

      expect(result.isActive).toBe(false)
    })

    it('should throw error on failure', async () => {
      mockDeactivateUseCase.execute.mockReturnValue(throwError(() => new Error('User not found')))

      await expect(controller.deactivate('user-id')).rejects.toThrow(Error)
    })
  })

  describe('reactivate', () => {
    it('should reactivate user', async () => {
      const user = makeUser({ isActive: true })
      mockDeactivateUseCase.execute.mockReturnValue(of(user))

      const result = await controller.reactivate('user-id')

      expect(result.isActive).toBe(true)
    })
  })

  describe('delete', () => {
    it('should return undefined', async () => {
      const result = await controller.delete('user-id')

      expect(result).toBeUndefined()
    })
  })
})
