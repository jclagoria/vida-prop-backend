import { of, throwError } from 'rxjs'
import type { IUserServicePort } from '@/modules/user-management/application/ports/i-user.service.js'
import { CreateUserUseCase } from '@/modules/user-management/application/use-cases/user/create-user.usecase.js'
import { User } from '@/modules/user-management/domain/entities/user.entity.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('CreateUserUseCase', () => {
  let userService: jest.Mocked<IUserServicePort>
  let useCase: CreateUserUseCase

  beforeEach(() => {
    userService = {
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deactivateUser: jest.fn(),
      reactivateUser: jest.fn(),
      getUserById: jest.fn(),
      getUserByEmail: jest.fn(),
    }
    useCase = new CreateUserUseCase(userService)
  })

  describe('execute', () => {
    it('should throw if email is missing', (done) => {
      useCase.execute({ email: '', password: 'SecurePass123', role: 'ADMIN' }).subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Email, password, and role are required')
          done()
        },
      })
    })

    it('should throw if password is missing', (done) => {
      useCase.execute({ email: 'test@example.com', password: '', role: 'ADMIN' }).subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Email, password, and role are required')
          done()
        },
      })
    })

    it('should throw if role is missing', (done) => {
      useCase
        .execute({ email: 'test@example.com', password: 'SecurePass123', role: '' })
        .subscribe({
          next: () => done.fail('Should have thrown'),
          error: (err) => {
            expect(err.message).toBe('Email, password, and role are required')
            done()
          },
        })
    })

    it('should throw if role is invalid', (done) => {
      useCase
        .execute({ email: 'test@example.com', password: 'SecurePass123', role: 'INVALID_ROLE' })
        .subscribe({
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
        email: Email.create('test@example.com'),
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      userService.createUser.mockReturnValue(of(user))

      useCase
        .execute({ email: 'test@example.com', password: 'SecurePass123', role: 'ADMIN' })
        .subscribe({
          next: (result) => {
            expect(result.email).toBe('test@example.com')
            expect(result.role).toBe('ADMIN')
            done()
          },
          error: done.fail,
        })
    })
  })
})
