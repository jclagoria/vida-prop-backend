import { Inject, Injectable, Logger, type LoggerService as NestLoggerService } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type * as winston from 'winston'

@Injectable()
export class CustomLoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger
  ) {}

  log(message: string, context?: string): void {
    this.logger.info(message, { context })
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context })
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context })
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context })
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context })
  }
}
