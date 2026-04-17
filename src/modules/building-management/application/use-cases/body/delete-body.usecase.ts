import { Injectable, Logger } from '@nestjs/common'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type { IBodyServicePort } from '../../ports/i-body.service'

@Injectable()
export class DeleteBodyUseCase {
  private readonly logger = new Logger(DeleteBodyUseCase.name)

  constructor(private readonly bodyService: IBodyServicePort) {}

  execute(id: string): Observable<void> {
    return this.bodyService.findById(id).pipe(
      switchMap((body) => {
        if (!body) {
          return throwError(() => new Error('Body not found'))
        }
        return this.bodyService.delete(id)
      }),
      catchError((error) => {
        this.logger.error(
          'DeleteBodyUseCase.execute failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'DeleteBodyUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        return throwError(() => error)
      })
    )
  }
}
