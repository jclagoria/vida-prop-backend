import { Test, type TestingModule } from '@nestjs/testing'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { JwtAdapter } from './jwt.adapter'

describe('JwtAdapter', () => {
  let adapter: JwtAdapter
  const secret = 'test-secret-key-minimum-32-characters-long!'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAdapter],
    }).compile()

    adapter = module.get<JwtAdapter>(JwtAdapter)
  })

  describe('generateAccessToken', () => {
    it.skip('should generate access token', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      }

      const token = await adapter.generateAccessToken(payload, secret).toPromise()
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token!.length).toBeGreaterThan(20)
    })
  })

  describe('generateRefreshToken', () => {
    it('should generate refresh token', async () => {
      const payload = { sub: 'user-123' }

      const token = await adapter.generateRefreshToken(payload, secret).toPromise()
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
    })
  })

  describe('verifyAccessToken', () => {
    it.skip('should verify and decode valid token', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      }

      const token = await adapter.generateAccessToken(payload, secret).toPromise()
      const decoded = await adapter.verifyAccessToken(token!, secret).toPromise()

      expect(decoded).toBeDefined()
      expect(decoded?.sub).toBe('user-123')
      expect(decoded?.email).toBe('test@example.com')
    })

    it.skip('should throw on invalid token', async () => {
      try {
        await adapter.verifyAccessToken('invalid-token', secret).toPromise()
        fail('Should have thrown')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })
})
