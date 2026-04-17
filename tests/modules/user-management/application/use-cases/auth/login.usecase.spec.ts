import { of, throwError } from 'rxjs'
import { IAuthServicePort } from '@/modules/user-management/application/ports/i-auth.service'
import { LoginUseCase } from '@/modules/user-management/application/use-cases/auth/login.usecase'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('LoginUseCase', () => {
  let useCase: LoginUseCase
  let mockAuthService: {
    validateCredentials: jest.Mock
    generateTokens: jest.Mock
  }

  const makeUser = () => {
    return new User({
      id: new UserId('user-id'),
      email: new Email('test@habitat.com'),
      passwordHash: 'hashed',
      role: UserRole.TENANT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  beforeEach(() => {
    mockAuthService = {
      validateCredentials: jest.fn(),
      generateTokens: jest.fn(),
    }

    useCase = new LoginUseCase(mockAuthService as never)
  })

  describe('execute', () => {
    it('should login successfully with valid credentials', (done) => {
      const user = makeUser()
      const tokens = { accessToken: 'access', refreshToken: 'refresh' }
      mockAuthService.validateCredentials.mockReturnValue(of(user))
      mockAuthService.generateTokens.mockReturnValue(of(tokens))

      useCase.execute('test@habitat.com', 'ValidPass123!').subscribe((result) => {
        expect(result.accessToken).toBe('access')
        done()
      })
    })

    it('should throw error with invalid credentials', (done) => {
      mockAuthService.validateCredentials.mockReturnValue(of(null))

      useCase.execute('test@habitat.com', 'WrongPass').subscribe({
        error: (error) => {
          expect(error.message).toContain('Invalid credentials')
          done()
        },
      })
    })

    it('should throw error when service fails', (done) => {
      mockAuthService.validateCredentials.mockReturnValue(
        throwError(() => new Error('Service error'))
      )

      useCase.execute('test@habitat.com', 'ValidPass123!').subscribe({
        error: (error) => {
          expect(error.message).toContain('Service error')
          done()
        },
      })
    })

    it('should throw error when generateTokens fails', (done) => {
      const user = makeUser()
      mockAuthService.validateCredentials.mockReturnValue(of(user))
      mockAuthService.generateTokens.mockReturnValue(
        throwError(() => new Error('Token generation failed'))
      )

      useCase.execute('test@habitat.com', 'ValidPass123!').subscribe({
        error: (error) => {
          expect(error.message).toContain('Token generation failed')
          done()
        },
      })
    })

    it('should handle error during token generation', (done) => {
      const user = makeUser()
      mockAuthService.validateCredentials.mockReturnValue(of(user))
      mockAuthService.generateTokens.mockReturnValue(throwError(() => new Error('JWT error')))

      useCase.execute('test@habitat.com', 'ValidPass123!').subscribe({
        error: (error) => {
          expect(error.message).toContain('JWT error')
          done()
        },
      })
    })
  })
})
