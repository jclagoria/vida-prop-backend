import type { RedisService } from '@common/redis/redis.service'
import { SessionService } from '@/modules/session/services/session.service'

describe('SessionService', () => {
  const createMockRedisService = () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  })

  describe('storeRefreshToken', () => {
    it('should store refresh token with default ttl', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.set.mockResolvedValue('OK')

      const sessionService = new SessionService(mockRedis as unknown as RedisService)

      await sessionService.storeRefreshToken('user-1', 'token-123')

      expect(mockRedis.set).toHaveBeenCalledWith('session:refresh:user-1', 'token-123', 604800)
    })

    it('should store refresh token with custom ttl', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.set.mockResolvedValue('OK')

      const sessionService = new SessionService(mockRedis as unknown as RedisService)

      await sessionService.storeRefreshToken('user-1', 'token-123', 3600)

      expect(mockRedis.set).toHaveBeenCalledWith('session:refresh:user-1', 'token-123', 3600)
    })
  })

  describe('getRefreshToken', () => {
    it('should return stored token', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.get.mockResolvedValue('stored-token')

      const sessionService = new SessionService(mockRedis as unknown as RedisService)

      const result = await sessionService.getRefreshToken('user-1')

      expect(result).toBe('stored-token')
      expect(mockRedis.get).toHaveBeenCalledWith('session:refresh:user-1')
    })

    it('should return null when no token stored', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.get.mockResolvedValue(null)

      const sessionService = new SessionService(mockRedis as unknown as RedisService)

      const result = await sessionService.getRefreshToken('user-1')

      expect(result).toBeNull()
    })
  })

  describe('revokeRefreshToken', () => {
    it('should delete stored token', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.del.mockResolvedValue(1)

      const sessionService = new SessionService(mockRedis as unknown as RedisService)

      await sessionService.revokeRefreshToken('user-1')

      expect(mockRedis.del).toHaveBeenCalledWith('session:refresh:user-1')
    })
  })

  describe('rotateRefreshToken', () => {
    it('should revoke old and store new token', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.del.mockResolvedValue(1)
      mockRedis.set.mockResolvedValue('OK')

      const sessionService = new SessionService(mockRedis as unknown as RedisService)

      await sessionService.rotateRefreshToken('user-1', 'new-token')

      expect(mockRedis.del).toHaveBeenCalledWith('session:refresh:user-1')
      expect(mockRedis.set).toHaveBeenCalledWith('session:refresh:user-1', 'new-token', 604800)
    })
  })

  describe('isTokenValid', () => {
    it('should return true when token matches', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.get.mockResolvedValue('stored-token')

      const sessionService = new SessionService(mockRedis as unknown as RedisService)

      const result = await sessionService.isTokenValid('user-1', 'stored-token')

      expect(result).toBe(true)
    })

    it('should return false when token does not match', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.get.mockResolvedValue('stored-token')

      const sessionService = new SessionService(mockRedis as unknown as RedisService)

      const result = await sessionService.isTokenValid('user-1', 'wrong-token')

      expect(result).toBe(false)
    })

    it('should return false when no token stored', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.get.mockResolvedValue(null)

      const sessionService = new SessionService(mockRedis as unknown as RedisService)

      const result = await sessionService.isTokenValid('user-1', 'some-token')

      expect(result).toBe(false)
    })
  })
})
