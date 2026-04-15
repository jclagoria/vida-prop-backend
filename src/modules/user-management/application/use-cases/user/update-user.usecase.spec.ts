import { of, throwError } from 'rxjs'
import type { IUserServicePort } from '@/modules/user-management/application/ports/i-user.service.js'
import { UpdateUserUseCase } from '@/modules/user-management/application/use-cases/user/update-user.usecase.js'
import { User } from '@/modules/user-management/domain/entities/user.entity.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('UpdateUserUseCase', () => {
  let userService: jest.Mocked<IUserServicePort>
  let useCase: UpdateUserUseCase

  beforeEach(() => {
    userService = {
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deactivateUser: jest.fn(),
      reactivateUser: jest.fn(),
      getUserById: jest.fn(),
      getUserByEmail: jest.fn(),
    }
    useCase = new UpdateUserUseCase(userService)
  })

  describe('execute', () => {
    it('should throw if userId is missing', (done) => {
      useCase.execute('', { email: 'test@example.com' }).subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('User ID is required')
          done()
        },
      })
    })

    it('should throw if role is invalid', (done) => {
      useCase.execute('user-123', { role: 'INVALID_ROLE' }).subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Invalid role')
          done()
        },
      })
    })

    it('should return result on success', (done) => {
      const user = User.create({
        id: UserId.generate(),
        email: Email.create('updated@example.com'),
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      userService.updateUser.mockReturnValue(of(user))

      useCase
        .execute('123e4567-e89b-12d3-a456-426614174000', { email: 'updated@example.com' })
        .subscribe({
          next: (result) => {
            expect(result.email).toBe('updated@example.com')
            done()
          },
          error: done.fail,
        })
    })
  })
})
