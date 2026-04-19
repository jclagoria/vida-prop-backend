import { Module } from '@nestjs/common'
import { CacheInterceptor } from './interceptors/cache.interceptor'

@Module({
  providers: [CacheInterceptor],
  exports: [CacheInterceptor],
})
export class CachingModule {}
