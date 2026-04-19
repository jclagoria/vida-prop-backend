import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { RedisService } from '../../common/redis/redis.service'
import { RedisThrottlerStorage } from '../../common/redis/redis-throttler.storage'
import { throttlerConfig } from '../../config/throttler.config'
import { ThrottlerGuard } from './guards/throttler.guard'

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [RedisService],
      useFactory: (redisService: RedisService) => ({
        ...throttlerConfig,
        storage: new RedisThrottlerStorage(redisService),
      }),
    }),
  ],
  providers: [ThrottlerGuard],
  exports: [ThrottlerGuard],
})
export class RateLimitingModule {}
