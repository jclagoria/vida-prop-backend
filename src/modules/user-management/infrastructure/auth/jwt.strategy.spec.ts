import { ConfigService } from '@nestjs/config'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { JwtStrategy } from './jwt.strategy'

describe('JwtStrategy', () => {
  let strategy: JwtStrategy

  beforeEach(() => {
    const configService = new ConfigService({
      JWT_SECRET: 'test-secret',
    })
    strategy = new JwtStrategy(configService)
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  describe('validate', () => {
    it('should return user from payload', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: 'ADMIN',
      }

      const result = await strategy.validate(payload)

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      })
    })

    it('should handle payload with required fields', async () => {
      const payload = {
        sub: 'user-456',
        email: 'admin@habitat.com',
        role: 'TENANT',
      }

      const result = await strategy.validate(payload)

      expect(result.id).toBe('user-456')
      expect(result.email).toBe('admin@habitat.com')
      expect(result.role).toBe(UserRole.TENANT)
    })

    it('should use default role when not provided', async () => {
      const payload = {
        sub: 'user-789',
      }

      const result = await strategy.validate(payload)

      expect(result.role).toBe(UserRole.TENANT)
      expect(result.email).toBe('')
    })
  })
})
