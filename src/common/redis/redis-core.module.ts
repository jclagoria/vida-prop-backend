import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getRedisModuleOptions } from '../config/redis.config'
import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [
    {
      provide: RedisService,
      useFactory: (configService: ConfigService) => {
        const options = getRedisModuleOptions(configService)
        return new RedisService(options)
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisCoreModule {}
