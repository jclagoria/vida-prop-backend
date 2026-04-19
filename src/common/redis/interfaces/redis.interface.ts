export interface RedisConfig {
  url: string
  keyPrefix: string
}

export interface RedisModuleOptions {
  config: RedisConfig
}

export interface CacheOptions {
  ttl: number
  prefix?: string
}

export interface SessionOptions {
  ttl: number
  prefix?: string
}
