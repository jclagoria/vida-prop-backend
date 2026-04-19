import { Injectable, Logger } from '@nestjs/common'
import type { RedisService } from './redis.service'

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name)

  constructor(private readonly redis: RedisService) {}

  async cache<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = await this.redis.get(key)
    if (cached) {
      this.logger.debug(`Cache hit: ${key}`)
      return JSON.parse(cached) as T
    }

    this.logger.debug(`Cache miss: ${key}`)
    const value = await fetcher()
    await this.redis.set(key, JSON.stringify(value), ttl ?? 300)
    return value
  }

  async invalidate(key: string): Promise<void> {
    await this.redis.del(key)
    this.logger.debug(`Invalidated: ${key}`)
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await Promise.all(keys.map((k) => this.redis.del(k)))
      this.logger.debug(`Invalidated ${keys.length} keys matching: ${pattern}`)
    }
  }

  async invalidateModule(module: string): Promise<void> {
    await this.invalidatePattern(`cache:${module}:*`)
  }
}
