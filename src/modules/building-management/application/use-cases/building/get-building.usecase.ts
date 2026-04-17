import { Injectable, Logger } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type { Building } from '@/modules/building-management/domain/entities/building.entity'
import type { IBuildingServicePort } from '../../ports/i-building.service'

@Injectable()
export class GetBuildingUseCase {
  private readonly logger = new Logger(GetBuildingUseCase.name)

  constructor(private readonly buildingService: IBuildingServicePort) {}

  execute(id: string): Observable<Building> {
    return this.buildingService.findById(id).pipe(
      switchMap((building) => {
        if (!building) {
          return throwError(() => new Error('Building not found'))
        }
        return new Observable<Building>((subscriber) => subscriber.next(building))
      }),
      catchError((error) => {
        this.logger.error(
          'GetBuildingUseCase.execute failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'GetBuildingUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        return throwError(() => error)
      })
    )
  }
}
