import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type * as winston from 'winston'
import type { Building } from '@/modules/building-management/domain/entities/building.entity'
import type { BuildingDomainService } from '@/modules/building-management/domain/services/building.domain-service'
import type { IBuildingServicePort } from '../../ports/i-building.service'

@Injectable()
export class DeleteBuildingUseCase {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger,
    private readonly buildingService: IBuildingServicePort,
    private readonly domainService: BuildingDomainService
  ) {}

  execute(id: string): Observable<void> {
    return this.buildingService.findById(id).pipe(
      switchMap((building) => {
        if (!building) {
          return throwError(() => new Error('Building not found'))
        }

        if (!this.domainService.canDeleteBuilding(building)) {
          return throwError(() => new Error('Building cannot be deleted due to active contracts'))
        }

        return this.buildingService.delete(id)
      }),
      catchError((error) => {
        this.logger.error('DeleteBuildingUseCase.execute failed', {
          trace: error instanceof Error ? error.stack : undefined,
          context: 'DeleteBuildingUseCase',
          operation: 'execute',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        return throwError(() => error)
      })
    )
  }
}
