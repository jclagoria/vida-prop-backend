import { Injectable, Logger } from '@nestjs/common'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type { IFloorServicePort } from '../../ports/i-floor.service'

@Injectable()
export class DeleteFloorUseCase {
  private readonly logger = new Logger(DeleteFloorUseCase.name)

  constructor(private readonly floorService: IFloorServicePort) {}

  execute(id: string): Observable<void> {
    return this.floorService.findById(id).pipe(
      switchMap((floor) => {
        if (!floor) {
          return throwError(() => new Error('Floor not found'))
        }
        return this.floorService.delete(id)
      }),
      catchError((error) => {
        this.logger.error(
          'DeleteFloorUseCase.execute failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'DeleteFloorUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        return throwError(() => error)
      })
    )
  }
}
