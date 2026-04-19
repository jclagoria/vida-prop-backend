import { SetMetadata } from '@nestjs/common'

export const CACHE_KEY = 'cache'
export const CACHE_TTL_KEY = 'cache-ttl'

export interface CacheableOptions {
  ttl?: number
  key?: string
}

export const Cacheable = (options: CacheableOptions = {}) => SetMetadata(CACHE_KEY, options)

export const getCacheOptions = (target: object): CacheableOptions => {
  return Reflect.getMetadata(CACHE_KEY, target) ?? {}
}
