import { Injectable, Logger } from '@nestjs/common'
import type { ThrottlerStorage } from '@nestjs/throttler'
import type { RedisService } from './redis.service'

export interface ThrottlerStorageRecord {
  totalHits: number
  timeToExpire: number
  isBlocked: boolean
  timeToBlockExpire: number
}

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly logger = new Logger(RedisThrottlerStorage.name)

  constructor(private readonly redis: RedisService) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string
  ): Promise<ThrottlerStorageRecord> {
    const fullKey = `throttler:${throttlerName}:${key}`
    const count = await this.redis.incr(fullKey)

    if (count === 1) {
      const ttlSeconds = Math.ceil(ttl / 1000)
      await this.redis.expire(fullKey, ttlSeconds)
      this.logger.debug(`Initialized throttle key: ${fullKey} with TTL ${ttlSeconds}s`)
    }

    const timeToExpire = await this.getTimeToExpire(fullKey)
    const isBlocked = count > limit

    return {
      totalHits: count,
      timeToExpire,
      isBlocked,
      timeToBlockExpire: isBlocked ? Math.ceil(blockDuration / 1000) : 0,
    }
  }

  private async getTimeToExpire(key: string): Promise<number> {
    const ttl = await (this.redis as any).client.ttl(key)
    return ttl > 0 ? ttl * 1000 : 0
  }
}
