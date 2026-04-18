import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type * as winston from 'winston'
import type { IBodyServicePort } from '../../ports/i-body.service'

@Injectable()
export class DeleteBodyUseCase {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger,
    private readonly bodyService: IBodyServicePort
  ) {}

  execute(id: string): Observable<void> {
    return this.bodyService.findById(id).pipe(
      switchMap((body) => {
        if (!body) {
          return throwError(() => new Error('Body not found'))
        }
        return this.bodyService.delete(id)
      }),
      catchError((error) => {
        this.logger.error('DeleteBodyUseCase.execute failed', {
          trace: error instanceof Error ? error.stack : undefined,
          context: 'DeleteBodyUseCase',
          operation: 'execute',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        return throwError(() => error)
      })
    )
  }
}
