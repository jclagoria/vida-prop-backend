import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { type Observable, throwError } from 'rxjs'
import { CORRELATION_ID_HEADER } from '../interceptors/correlation-id.interceptor'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): Observable<unknown> {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const correlationId = request.headers[CORRELATION_ID_HEADER]
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error'

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      correlationId,
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as Record<string, unknown>).message,
    }

    this.logger.error(
      JSON.stringify({
        correlationId,
        method: request.method,
        url: request.url,
        status,
        error: errorResponse,
        stack: exception instanceof Error ? exception.stack : undefined,
      })
    )

    response.status(status).json(errorResponse)

    return throwError(() => exception)
  }
}
