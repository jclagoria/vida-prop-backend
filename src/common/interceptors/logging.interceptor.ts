import * as crypto from 'node:crypto'
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import type { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { CORRELATION_ID_HEADER } from './correlation-id.interceptor'

const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'creditCard', 'cvv']

function maskSensitiveData(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data
  if (Array.isArray(data)) return data.map(maskSensitiveData)

  const masked: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field))) {
      masked[key] = `${crypto.randomBytes(8).toString('hex').slice(0, 4)}****`
    } else {
      masked[key] = maskSensitiveData(value)
    }
  }
  return masked
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    const { method, url, headers, body, query, params } = request
    const correlationId = headers[CORRELATION_ID_HEADER]
    const now = Date.now()

    this.logger.debug(
      'Incoming request',
      JSON.stringify({
        correlationId,
        method,
        url,
        query: maskSensitiveData(query),
        params: maskSensitiveData(params),
        body: maskSensitiveData(body),
      })
    )

    this.logger.debug(
      'Incoming request',
      JSON.stringify({
        correlationId,
        method,
        url,
        query: maskSensitiveData(query),
        params: maskSensitiveData(params),
        body: maskSensitiveData(body),
      })
    )

    return next.handle().pipe(
      tap({
        next: (data) => {
          const delay = Date.now() - now
          this.logger.log(
            JSON.stringify({
              correlationId,
              method,
              url,
              statusCode: response.statusCode,
              responseTime: `${delay}ms`,
              responseBody: maskSensitiveData(data),
            })
          )
        },
        error: (error) => {
          const delay = Date.now() - now
          this.logger.error(
            JSON.stringify({
              correlationId,
              method,
              url,
              statusCode: response.statusCode,
              responseTime: `${delay}ms`,
              error: error.message,
            })
          )
        },
      })
    )
  }
}
