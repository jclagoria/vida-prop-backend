import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import Redis from 'ioredis'
import type { RedisModuleOptions } from '../config/redis.config'

export interface ILogger {
  info: (message: string, meta?: Record<string, unknown>) => void
  error: (message: string, meta?: Record<string, unknown>) => void
  warn: (message: string, meta?: Record<string, unknown>) => void
  debug: (message: string, meta?: Record<string, unknown>) => void
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Redis
  private readonly logger = new Logger(RedisService.name)

  constructor(private readonly options: RedisModuleOptions) {
    this.client = new Redis(this.options.url, {
      keyPrefix: this.options.keyPrefix,
      lazyConnect: this.options.lazyConnect,
      retryStrategy: this.options.retryStrategy,
      maxRetriesPerRequest: this.options.maxRetriesPerRequest,
    })
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Redis service initialized (auto-connect enabled)')
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit()
    this.logger.log('Redis disconnected')
  }

  async get(key: string): Promise<string | null> {
    const value = await this.client.get(key)
    this.logger.debug(`GET ${key}`)
    return value
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl)
    } else {
      await this.client.set(key, value)
    }
    this.logger.debug(`SET ${key}`)
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
    this.logger.debug(`DEL ${key}`)
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key)
    return result === 1
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.client.expire(key, ttl)
    this.logger.debug(`EXPIRE ${key} ${ttl}`)
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern)
  }

  async flushdb(): Promise<void> {
    await this.client.flushdb()
    this.logger.log('Flushed Redis database')
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key)
  }

  async decr(key: string): Promise<number> {
    return this.client.decr(key)
  }

  async isConnected(): Promise<boolean> {
    return this.client.status === 'ready'
  }
}
