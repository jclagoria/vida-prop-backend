import { from, of, throwError } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { Password } from '@/modules/user-management/domain/value-objects/password.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'
import { BcryptAdapter } from '@/modules/user-management/infrastructure/adapters/bcrypt.adapter'
import { JwtAdapter } from '@/modules/user-management/infrastructure/adapters/jwt.adapter'
import { AuthService } from '@/modules/user-management/infrastructure/services/auth.service'

describe('AuthService', () => {
  let service: AuthService
  let mockJwtAdapter: { generateTokens: jest.Mock; refreshToken: jest.Mock }
  let mockBcryptAdapter: { hash: jest.Mock; compare: jest.Mock }
  let mockUserRepository: { findByEmail: jest.Mock }

  const makeUser = () => {
    return new User({
      id: new UserId('test-uuid'),
      email: new Email('test@habitat.com'),
      passwordHash: 'hashed_password',
      role: UserRole.TENANT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  beforeEach(() => {
    mockJwtAdapter = {
      generateTokens: jest.fn().mockReturnValue({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      }),
      refreshToken: jest.fn().mockReturnValue({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      }),
    }

    mockBcryptAdapter = {
      hash: jest.fn().mockReturnValue('hashed_password'),
      compare: jest.fn(),
    }

    mockUserRepository = {
      findByEmail: jest.fn(),
    }

    service = new AuthService(
      mockJwtAdapter as never,
      mockBcryptAdapter as never,
      mockUserRepository as never
    )
  })

  describe('validateCredentials', () => {
    it('should return user when credentials are valid', (done) => {
      const user = makeUser()
      mockUserRepository.findByEmail.mockReturnValue(of(user))
      mockBcryptAdapter.compare.mockReturnValue(true)

      const email = new Email('test@habitat.com')
      const password = new Password('ValidPass123!')

      service.validateCredentials(email, password).subscribe((result) => {
        expect(result).toBe(user)
        done()
      })
    })

    it('should return null when user not found', (done) => {
      mockUserRepository.findByEmail.mockReturnValue(of(null))

      const email = new Email('notfound@habitat.com')
      const password = new Password('ValidPass123!')

      service.validateCredentials(email, password).subscribe((result) => {
        expect(result).toBeNull()
        done()
      })
    })

    it('should return null when password is invalid', (done) => {
      const user = makeUser()
      mockUserRepository.findByEmail.mockReturnValue(of(user))
      mockBcryptAdapter.compare.mockReturnValue(false)

      const email = new Email('test@habitat.com')
      const password = new Password('WrongPass123!')

      service.validateCredentials(email, password).subscribe((result) => {
        expect(result).toBeNull()
        done()
      })
    })
  })

  describe('generateTokens', () => {
    it('should generate tokens for user', (done) => {
      const user = makeUser()
      service.generateTokens(user).subscribe((tokens) => {
        expect(tokens.accessToken).toBe('access_token')
        expect(tokens.refreshToken).toBe('refresh_token')
        done()
      })
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', (done) => {
      service.refreshToken('valid_refresh_token').subscribe((tokens) => {
        expect(tokens.accessToken).toBe('new_access_token')
        done()
      })
    })

    it('should throw error for invalid token', (done) => {
      mockJwtAdapter.refreshToken.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      service.refreshToken('invalid_token').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invalid token')
          done()
        },
      })
    })
  })

  describe('hashPassword', () => {
    it('should hash password', () => {
      const password = new Password('ValidPass123!')
      const hashed = service.hashPassword(password)
      expect(hashed).toBe('hashed_password')
      expect(mockBcryptAdapter.hash).toHaveBeenCalled()
    })
  })

  describe('comparePassword', () => {
    it('should compare password', () => {
      const password = new Password('ValidPass123!')
      mockBcryptAdapter.compare.mockReturnValue(true)
      const result = service.comparePassword(password, 'hashed')
      expect(result).toBe(true)
    })
  })
})
