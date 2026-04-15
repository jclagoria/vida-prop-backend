import { of, throwError } from 'rxjs'
import type { IAuthServicePort } from '@/modules/user-management/application/ports/i-auth.service.js'
import { LoginUseCase } from '@/modules/user-management/application/use-cases/auth/login.usecase.js'
import { User } from '@/modules/user-management/domain/entities/user.entity.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('LoginUseCase', () => {
  let authService: jest.Mocked<IAuthServicePort>
  let useCase: LoginUseCase

  beforeEach(() => {
    authService = {
      validateCredentials: jest.fn(),
      generateTokens: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    }
    useCase = new LoginUseCase(authService)
  })

  describe('execute', () => {
    it('should throw if email is missing', (done) => {
      useCase.execute({ email: '', password: 'SecurePass123' }).subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Email and password are required')
          done()
        },
      })
    })

    it('should throw if password is missing', (done) => {
      useCase.execute({ email: 'test@example.com', password: '' }).subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Email and password are required')
          done()
        },
      })
    })

    it('should return tokens for valid credentials', (done) => {
      const user = User.create({
        id: UserId.generate(),
        email: Email.create('test@example.com'),
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      authService.validateCredentials.mockReturnValue(of(user))
      authService.generateTokens.mockReturnValue(
        of({ accessToken: 'access-token', refreshToken: 'refresh-token' })
      )

      useCase.execute({ email: 'test@example.com', password: 'SecurePass123' }).subscribe({
        next: (result) => {
          expect(result.email).toBe('test@example.com')
          expect(result.accessToken).toBe('access-token')
          expect(result.refreshToken).toBe('refresh-token')
          done()
        },
        error: done.fail,
      })
    })

    it('should throw for invalid credentials', (done) => {
      authService.validateCredentials.mockReturnValue(of(null))

      useCase.execute({ email: 'test@example.com', password: 'WrongPass123' }).subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Invalid credentials')
          done()
        },
      })
    })

    it('should throw if email invalid format', (done) => {
      useCase.execute({ email: 'not-an-email', password: 'SecurePass123' }).subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toContain('Invalid email')
          done()
        },
      })
    })
  })
})
