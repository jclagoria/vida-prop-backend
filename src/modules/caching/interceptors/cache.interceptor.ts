import { RedisCacheService } from '@common/redis/redis-cache.service'
import {
  type CallHandler,
  type ExecutionContext,
  Inject,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common'
import { type Observable, of } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'

@Injectable()
export class CacheInterceptor<T> implements NestInterceptor<T, T> {
  constructor(
    @Inject(RedisCacheService)
    private readonly cacheService: RedisCacheService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    const request = context.switchToHttp().getRequest()
    const key = this.getCacheKey(request)

    return of(key).pipe(
      switchMap((cacheKey) =>
        of(null).pipe(
          // TODO: Implement cache check and response
        )
      )
    ) as Observable<T>
  }

  private getCacheKey(request: { url?: string; query?: Record<string, unknown> }): string {
    const url = request.url ?? ''
    const query = request.query ?? {}
    const queryString = Object.entries(query)
      .filter(([, v]) => v != null)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
    return `cache:${url}${queryString ? `?${queryString}` : ''}`
  }
}
