import { of, throwError } from 'rxjs'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'
import { BcryptAdapter } from '@/modules/user-management/infrastructure/adapters/bcrypt.adapter'
import { JwtAdapter } from '@/modules/user-management/infrastructure/adapters/jwt.adapter'

describe('BcryptAdapter', () => {
  let adapter: BcryptAdapter

  beforeEach(() => {
    adapter = new BcryptAdapter()
  })

  describe('hash', () => {
    it('should hash password and return different string', () => {
      const hashed = adapter.hash('password123')
      expect(hashed).not.toBe('password123')
    })

    it('should produce consistent hashes for same input', () => {
      const hash1 = adapter.hash('password123')
      const hash2 = adapter.hash('password123')
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('compare', () => {
    it('should return true for correct password', () => {
      const hashed = adapter.hash('password123')
      const result = adapter.compare('password123', hashed)
      expect(result).toBe(true)
    })

    it('should return false for wrong password', () => {
      const hashed = adapter.hash('password123')
      const result = adapter.compare('wrongpassword', hashed)
      expect(result).toBe(false)
    })
  })
})

describe('JwtAdapter', () => {
  let adapter: JwtAdapter
  let mockJwtService: { sign: jest.Mock; verify: jest.Mock }

  const makeUser = () => {
    return new User({
      id: new UserId('test-uuid'),
      email: new Email('test@habitat.com'),
      passwordHash: 'hashed',
      role: UserRole.TENANT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  beforeEach(() => {
    mockJwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
      verify: jest.fn(),
    }

    adapter = new JwtAdapter(mockJwtService as never)
  })

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const tokens = adapter.generateTokens(makeUser())

      expect(tokens.accessToken).toBe('signed-token')
      expect(tokens.refreshToken).toBe('signed-token')
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2)
    })
  })

  describe('refreshToken', () => {
    it('should refresh token and return new tokens', () => {
      mockJwtService.verify.mockReturnValue({
        sub: 'test-uuid',
        email: 'test@habitat.com',
        role: UserRole.TENANT,
      })

      const tokens = adapter.refreshToken('old-token')

      expect(tokens.accessToken).toBe('signed-token')
      expect(mockJwtService.verify).toHaveBeenCalled()
    })
  })

  describe('validateToken', () => {
    it('should return payload for valid token', () => {
      const payload = { sub: 'test-uuid', email: 'test@habitat.com', role: 'TENANT' }
      mockJwtService.verify.mockReturnValue(payload)

      const result = adapter.validateToken('valid-token')

      expect(result).toEqual(payload)
    })

    it('should return null for invalid token', () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const result = adapter.validateToken('invalid-token')

      expect(result).toBeNull()
    })
  })
})
