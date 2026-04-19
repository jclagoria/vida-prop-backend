import type { ConfigService } from '@nestjs/config'

export interface RedisModuleOptions {
  url: string
  keyPrefix: string
  lazyConnect: boolean
  retryStrategy: (times: number) => number | undefined
  maxRetriesPerRequest: number
}

export const getRedisModuleOptions = (configService: ConfigService): RedisModuleOptions => {
  return {
    url: configService.get<string>('REDIS_URL') || 'redis://localhost:6379',
    keyPrefix: configService.get<string>('REDIS_KEY_PREFIX') || 'habitat:',
    lazyConnect: false,
    retryStrategy: (times: number) => {
      if (times > 3) {
        return -1
      }
      return Math.min(times * 200, 2000)
    },
    maxRetriesPerRequest: 3,
  }
}
