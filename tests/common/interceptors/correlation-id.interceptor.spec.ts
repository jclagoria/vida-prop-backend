import type { CallHandler, ExecutionContext } from '@nestjs/common'
import { of } from 'rxjs'
import { tap } from 'rxjs/operators'

function createCorrelationIdInterceptor(): {
  intercept: (context: ExecutionContext, next: CallHandler) => any
} {
  const CORRELATION_ID_HEADER = 'x-correlation-id'

  return {
    intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest()
      const correlationId = request.headers[CORRELATION_ID_HEADER] || 'generated-id-123'
      request.headers[CORRELATION_ID_HEADER] = correlationId

      return next.handle().pipe(
        tap(() => {
          const response = context.switchToHttp().getResponse()
          response.setHeader(CORRELATION_ID_HEADER, correlationId)
        })
      )
    },
  }
}

describe('CorrelationIdInterceptor (unit)', () => {
  const createMockContext = (existingId?: string) => {
    const headers: Record<string, string> = {}
    if (existingId) headers['x-correlation-id'] = existingId

    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
        getResponse: () => ({ setHeader: jest.fn() }),
      }),
    }
  }

  const createMockNext = () => ({
    handle: () => of('result'),
  })

  it('should use existing correlation id', () => {
    const interceptor = createCorrelationIdInterceptor()
    const context = createMockContext('existing-id') as any
    const next = createMockNext()

    interceptor.intercept(context, next)

    expect(context.switchToHttp().getRequest().headers['x-correlation-id']).toBe('existing-id')
  })

  it('should generate new correlation id when not provided', () => {
    const interceptor = createCorrelationIdInterceptor()
    const context = createMockContext() as any
    const next = createMockNext()

    interceptor.intercept(context, next)

    expect(context.switchToHttp().getRequest().headers['x-correlation-id']).toBeDefined()
  })
})
