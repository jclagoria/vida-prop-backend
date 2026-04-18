import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type * as winston from 'winston'
import type { Building } from '@/modules/building-management/domain/entities/building.entity'
import type { IBuildingServicePort } from '../../ports/i-building.service'

@Injectable()
export class GetBuildingUseCase {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger,
    private readonly buildingService: IBuildingServicePort
  ) {}

  execute(id: string): Observable<Building> {
    return this.buildingService.findById(id).pipe(
      switchMap((building) => {
        if (!building) {
          return throwError(() => new Error('Building not found'))
        }
        return new Observable<Building>((subscriber) => subscriber.next(building))
      }),
      catchError((error) => {
        this.logger.error('GetBuildingUseCase.execute failed', {
          trace: error instanceof Error ? error.stack : undefined,
          context: 'GetBuildingUseCase',
          operation: 'execute',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        return throwError(() => error)
      })
    )
  }
}
