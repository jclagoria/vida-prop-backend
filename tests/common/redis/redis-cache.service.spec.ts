import type { RedisService } from '../../../src/common/redis/redis.service'
import { RedisCacheService } from '../../../src/common/redis/redis-cache.service'

describe('RedisCacheService', () => {
  const createMockRedisService = () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  })

  describe('cache', () => {
    it('should return cached value when exists', async () => {
      const mockRedis = createMockRedisService()
      const cachedData = { id: 1, name: 'test' }
      mockRedis.get.mockResolvedValue(JSON.stringify(cachedData))

      const cacheService = new RedisCacheService(mockRedis as unknown as RedisService)
      const fetcher = jest.fn()

      const result = await cacheService.cache('key', fetcher)

      expect(result).toEqual(cachedData)
      expect(mockRedis.get).toHaveBeenCalledWith('key')
      expect(fetcher).not.toHaveBeenCalled()
    })

    it('should fetch and cache value when not cached', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.get.mockResolvedValue(null)

      const cacheService = new RedisCacheService(mockRedis as unknown as RedisService)
      const fetcher = jest.fn().mockResolvedValue({ id: 1, name: 'test' })

      const result = await cacheService.cache('key', fetcher)

      expect(result).toEqual({ id: 1, name: 'test' })
      expect(fetcher).toHaveBeenCalled()
      expect(mockRedis.set).toHaveBeenCalledWith(
        'key',
        JSON.stringify({ id: 1, name: 'test' }),
        300
      )
    })

    it('should use custom ttl when provided', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.get.mockResolvedValue(null)

      const cacheService = new RedisCacheService(mockRedis as unknown as RedisService)
      const fetcher = jest.fn().mockResolvedValue({ id: 1 })

      await cacheService.cache('key', fetcher, 600)

      expect(mockRedis.set).toHaveBeenCalledWith('key', JSON.stringify({ id: 1 }), 600)
    })
  })

  describe('invalidate', () => {
    it('should delete cache key', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.del.mockResolvedValue(1)

      const cacheService = new RedisCacheService(mockRedis as unknown as RedisService)

      await cacheService.invalidate('key')

      expect(mockRedis.del).toHaveBeenCalledWith('key')
    })
  })

  describe('invalidatePattern', () => {
    it('should delete all keys matching pattern', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.keys.mockResolvedValue(['cache:key1', 'cache:key2'])
      mockRedis.del.mockResolvedValue(1)

      const cacheService = new RedisCacheService(mockRedis as unknown as RedisService)

      await cacheService.invalidatePattern('cache:*')

      expect(mockRedis.keys).toHaveBeenCalledWith('cache:*')
      expect(mockRedis.del).toHaveBeenCalledTimes(2)
    })

    it('should not delete when no keys match', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.keys.mockResolvedValue([])

      const cacheService = new RedisCacheService(mockRedis as unknown as RedisService)

      await cacheService.invalidatePattern('cache:*')

      expect(mockRedis.keys).toHaveBeenCalledWith('cache:*')
      expect(mockRedis.del).not.toHaveBeenCalled()
    })
  })

  describe('invalidateModule', () => {
    it('should invalidate all keys for module', async () => {
      const mockRedis = createMockRedisService()
      mockRedis.keys.mockResolvedValue(['cache:users:1', 'cache:users:2'])
      mockRedis.del.mockResolvedValue(1)

      const cacheService = new RedisCacheService(mockRedis as unknown as RedisService)

      await cacheService.invalidateModule('users')

      expect(mockRedis.keys).toHaveBeenCalledWith('cache:users:*')
    })
  })
})
