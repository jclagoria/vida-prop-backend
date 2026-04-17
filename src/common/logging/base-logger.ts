import { Inject, Injectable, type LoggerService as NestLoggerService } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type * as winston from 'winston'

export type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  module?: string
  service?: string
  operation?: string
  correlationId?: string
  [key: string]: unknown
}

@Injectable()
export class BaseLogger implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger
  ) {}

  log(message: string, context?: string): void {
    this.logger.info(message, { context })
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context })
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context })
  }

  info(message: string, context?: string): void {
    this.logger.info(message, { context })
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context })
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context })
  }

  logOperation(
    service: string,
    operation: string,
    status: 'started' | 'success' | 'failed',
    meta?: Record<string, unknown>
  ): void {
    const level = status === 'failed' ? 'error' : 'info'
    const message = `${service}.${operation} ${status}`

    if (level === 'error') {
      this.logger.error(message, { ...meta, service, operation, status })
    } else {
      this.logger.info(message, { ...meta, service, operation, status })
    }
  }
}
