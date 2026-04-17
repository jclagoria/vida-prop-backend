import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common'
import type { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'

export const CORRELATION_ID_HEADER = 'x-correlation-id'

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest()
    const correlationId = request.headers[CORRELATION_ID_HEADER] || uuidv4()
    request.headers[CORRELATION_ID_HEADER] = correlationId

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse()
        response.setHeader(CORRELATION_ID_HEADER, correlationId)
      })
    )
  }
}
