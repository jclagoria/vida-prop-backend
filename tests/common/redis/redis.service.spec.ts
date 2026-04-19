import type { RedisModuleOptions } from '../../../src/common/config/redis.config'
import { RedisService } from '../../../src/common/redis/redis.service'

describe('RedisService', () => {
  const createMockRedis = () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    keys: jest.fn(),
    flushdb: jest.fn(),
    incr: jest.fn(),
    decr: jest.fn(),
    connect: jest.fn(),
    quit: jest.fn(),
    status: 'ready',
  })

  const defaultOptions: RedisModuleOptions = {
    url: 'redis://localhost:6379',
    keyPrefix: 'test:',
    lazyConnect: false,
    retryStrategy: (times: number) => (times > 3 ? undefined : Math.min(times * 200, 2000)),
    maxRetriesPerRequest: 3,
  }

  describe('get', () => {
    it('should return value from redis', async () => {
      const mockRedis = createMockRedis()
      mockRedis.get.mockResolvedValue('test-value')

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      const result = await service.get('key')

      expect(result).toBe('test-value')
      expect(mockRedis.get).toHaveBeenCalledWith('key')
    })

    it('should return null when key not found', async () => {
      const mockRedis = createMockRedis()
      mockRedis.get.mockResolvedValue(null)

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      const result = await service.get('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('set', () => {
    it('should set value without ttl', async () => {
      const mockRedis = createMockRedis()
      mockRedis.set.mockResolvedValue('OK')

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      await service.set('key', 'value')

      expect(mockRedis.set).toHaveBeenCalledWith('key', 'value')
    })

    it('should set value with ttl', async () => {
      const mockRedis = createMockRedis()
      mockRedis.set.mockResolvedValue('OK')

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      await service.set('key', 'value', 300)

      expect(mockRedis.set).toHaveBeenCalledWith('key', 'value', 'EX', 300)
    })
  })

  describe('del', () => {
    it('should delete key', async () => {
      const mockRedis = createMockRedis()
      mockRedis.del.mockResolvedValue(1)

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      await service.del('key')

      expect(mockRedis.del).toHaveBeenCalledWith('key')
    })
  })

  describe('exists', () => {
    it('should return true when key exists', async () => {
      const mockRedis = createMockRedis()
      mockRedis.exists.mockResolvedValue(1)

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      const result = await service.exists('key')

      expect(result).toBe(true)
    })

    it('should return false when key does not exist', async () => {
      const mockRedis = createMockRedis()
      mockRedis.exists.mockResolvedValue(0)

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      const result = await service.exists('nonexistent')

      expect(result).toBe(false)
    })
  })

  describe('incr', () => {
    it('should increment counter', async () => {
      const mockRedis = createMockRedis()
      mockRedis.incr.mockResolvedValue(1)

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      const result = await service.incr('counter')

      expect(result).toBe(1)
    })
  })

  describe('decr', () => {
    it('should decrement counter', async () => {
      const mockRedis = createMockRedis()
      mockRedis.decr.mockResolvedValue(0)

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      const result = await service.decr('counter')

      expect(result).toBe(0)
    })
  })

  describe('keys', () => {
    it('should return keys matching pattern', async () => {
      const mockRedis = createMockRedis()
      mockRedis.keys.mockResolvedValue(['key1', 'key2'])

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      const result = await service.keys('key*')

      expect(result).toEqual(['key1', 'key2'])
    })
  })

  describe('isConnected', () => {
    it('should return true when connected', async () => {
      const mockRedis = createMockRedis()
      mockRedis.status = 'ready'

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      const result = await service.isConnected()

      expect(result).toBe(true)
    })

    it('should return false when not connected', async () => {
      const mockRedis = createMockRedis()
      mockRedis.status = 'end'

      const service = new RedisService(defaultOptions)
      ;(service as any).client = mockRedis

      const result = await service.isConnected()

      expect(result).toBe(false)
    })
  })
})
