import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type * as winston from 'winston'
import type { IFloorServicePort } from '../../ports/i-floor.service'

@Injectable()
export class DeleteFloorUseCase {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger,
    private readonly floorService: IFloorServicePort
  ) {}

  execute(id: string): Observable<void> {
    return this.floorService.findById(id).pipe(
      switchMap((floor) => {
        if (!floor) {
          return throwError(() => new Error('Floor not found'))
        }
        return this.floorService.delete(id)
      }),
      catchError((error) => {
        this.logger.error('DeleteFloorUseCase.execute failed', {
          trace: error instanceof Error ? error.stack : undefined,
          context: 'DeleteFloorUseCase',
          operation: 'execute',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        return throwError(() => error)
      })
    )
  }
}
