import { Logger } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { throwError } from 'rxjs'
import { catchError as rxCatchError } from 'rxjs/operators'

export interface UseCaseContext {
  useCase: string
  correlationId?: string
}

export abstract class BaseUseCase<_TInput, _TOutput> {
  protected readonly logger = new Logger(this.constructor.name)

  protected catchAndLog<T>(source: Observable<T>, context: UseCaseContext): Observable<T> {
    return source.pipe(
      rxCatchError((error) => {
        this.logger.error(`${context.useCase} failed: ${error.message}`, error.stack)
        return throwError(() => error)
      })
    )
  }
}
