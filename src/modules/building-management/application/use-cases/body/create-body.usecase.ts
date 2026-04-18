import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type * as winston from 'winston'
import { Body } from '@/modules/building-management/domain/entities/body.entity'
import type { CreateBodyDto } from '../../dto/create-body.dto'
import type { IBodyServicePort } from '../../ports/i-body.service'
import type { IBuildingServicePort } from '../../ports/i-building.service'

@Injectable()
export class CreateBodyUseCase {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger,
    private readonly buildingService: IBuildingServicePort,
    private readonly bodyService: IBodyServicePort
  ) {}

  execute(buildingId: string, dto: CreateBodyDto): Observable<Body> {
    return this.buildingService.findById(buildingId).pipe(
      switchMap((building) => {
        if (!building) {
          return throwError(() => new Error('Building not found'))
        }

        const _body = Body.create(building.id, dto.name)
        return this.bodyService.create(buildingId, dto)
      }),
      catchError((error) => {
        this.logger.error('CreateBodyUseCase.execute failed', {
          trace: error instanceof Error ? error.stack : undefined,
          context: 'CreateBodyUseCase',
          operation: 'execute',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        return throwError(() => error)
      })
    )
  }
}
