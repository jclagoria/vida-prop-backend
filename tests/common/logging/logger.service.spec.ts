import type * as winston from 'winston'
import { CustomLoggerService } from '@/common/logging/logger.service'

describe('CustomLoggerService', () => {
  let mockWinstonLogger: winston.Logger
  let loggerService: CustomLoggerService

  beforeEach(() => {
    mockWinstonLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as unknown as winston.Logger

    loggerService = new CustomLoggerService(mockWinstonLogger)
  })

  it('should log info message with context', () => {
    loggerService.log('test message', 'TestContext')

    expect(mockWinstonLogger.info).toHaveBeenCalledWith('test message', {
      context: 'TestContext',
    })
  })

  it('should log error with trace and context', () => {
    loggerService.error('error message', 'trace info', 'ErrorContext')

    expect(mockWinstonLogger.error).toHaveBeenCalledWith('error message', {
      trace: 'trace info',
      context: 'ErrorContext',
    })
  })

  it('should log warn with context', () => {
    loggerService.warn('warning message', 'WarnContext')

    expect(mockWinstonLogger.warn).toHaveBeenCalledWith('warning message', {
      context: 'WarnContext',
    })
  })

  it('should log debug with context', () => {
    loggerService.debug('debug message', 'DebugContext')

    expect(mockWinstonLogger.debug).toHaveBeenCalledWith('debug message', {
      context: 'DebugContext',
    })
  })

  it('should log verbose (trace level) with context', () => {
    loggerService.verbose('verbose message', 'TraceContext')

    expect(mockWinstonLogger.verbose).toHaveBeenCalledWith('verbose message', {
      context: 'TraceContext',
    })
  })
})

describe('maskSensitiveData', () => {
  const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'creditCard', 'cvv']

  function maskSensitiveData(data: unknown): unknown {
    if (!data || typeof data !== 'object') return data
    if (Array.isArray(data)) return data.map(maskSensitiveData)

    const masked: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field))) {
        masked[key] = '****'
      } else {
        masked[key] = maskSensitiveData(value)
      }
    }
    return masked
  }

  it('should mask password field', () => {
    const data = { password: 'secret123', name: 'John' }
    const masked = maskSensitiveData(data) as Record<string, unknown>

    expect(masked).toHaveProperty('password')
    expect(masked.password).toBe('****')
    expect(masked.name).toBe('John')
  })

  it('should mask token field', () => {
    const data = { token: 'abc123', name: 'Jane' }
    const masked = maskSensitiveData(data) as Record<string, unknown>

    expect(masked).toHaveProperty('token')
    expect(masked.token).toBe('****')
  })

  it('should mask secret field', () => {
    const data = { api_secret: 'super-secret', name: 'Bob' }
    const masked = maskSensitiveData(data) as Record<string, unknown>

    expect(masked).toHaveProperty('api_secret')
    expect(masked.api_secret).toBe('****')
  })

  it('should not mask non-sensitive fields', () => {
    const data = { name: 'Alice', email: 'alice@test.com' }
    const masked = maskSensitiveData(data) as Record<string, unknown>

    expect(masked.name).toBe('Alice')
    expect(masked.email).toBe('alice@test.com')
  })

  it('should handle nested objects recursively', () => {
    const data = { user: { password: 'nested-secret', name: 'Nested' } }
    const masked = maskSensitiveData(data) as Record<string, unknown>

    expect(masked.user).toHaveProperty('password')
    expect((masked.user as Record<string, unknown>).password).toBe('****')
  })

  it('should handle arrays', () => {
    const data = [{ password: 'secret1' }, { password: 'secret2' }]
    const masked = maskSensitiveData(data)

    expect(Array.isArray(masked)).toBe(true)
    expect((masked as unknown[])[0]).toHaveProperty('password')
  })

  it('should return non-object data as-is', () => {
    expect(maskSensitiveData('string')).toBe('string')
    expect(maskSensitiveData(123)).toBe(123)
    expect(maskSensitiveData(null)).toBe(null)
    expect(maskSensitiveData(undefined)).toBe(undefined)
  })
})

describe('CORRELATION_ID_HEADER', () => {
  it('should be x-correlation-id', () => {
    const CORRELATION_ID_HEADER = 'x-correlation-id'
    expect(CORRELATION_ID_HEADER).toBe('x-correlation-id')
  })
})
