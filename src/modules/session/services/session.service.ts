import type { RedisService } from '@common/redis/redis.service'
import { Injectable, Logger } from '@nestjs/common'

const DEFAULT_TTL = 604800

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name)

  constructor(private readonly redis: RedisService) {}

  async storeRefreshToken(userId: string, token: string, ttl = DEFAULT_TTL): Promise<void> {
    const key = `session:refresh:${userId}`
    await this.redis.set(key, token, ttl)
    this.logger.debug(`Stored refresh token for user: ${userId}`)
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `session:refresh:${userId}`
    return this.redis.get(key)
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    const key = `session:refresh:${userId}`
    await this.redis.del(key)
    this.logger.debug(`Revoked refresh token for user: ${userId}`)
  }

  async rotateRefreshToken(userId: string, newToken: string, ttl = DEFAULT_TTL): Promise<void> {
    await this.revokeRefreshToken(userId)
    await this.storeRefreshToken(userId, newToken, ttl)
    this.logger.debug(`Rotated refresh token for user: ${userId}`)
  }

  async isTokenValid(userId: string, token: string): Promise<boolean> {
    const stored = await this.getRefreshToken(userId)
    return stored === token
  }
}
