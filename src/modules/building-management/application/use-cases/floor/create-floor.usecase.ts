import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type * as winston from 'winston'
import { Floor } from '@/modules/building-management/domain/entities/floor.entity'
import type { CreateFloorDto } from '../../dto/create-floor.dto'
import type { IBodyServicePort } from '../../ports/i-body.service'
import type { IFloorServicePort } from '../../ports/i-floor.service'

@Injectable()
export class CreateFloorUseCase {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger,
    private readonly bodyService: IBodyServicePort,
    private readonly floorService: IFloorServicePort
  ) {}

  execute(bodyId: string, dto: CreateFloorDto): Observable<Floor> {
    return this.bodyService.findById(bodyId).pipe(
      switchMap((body) => {
        if (!body) {
          return throwError(() => new Error('Body not found'))
        }

        const _floor = Floor.create(body.id, dto.floorNumber)
        return this.floorService.create(bodyId, dto)
      }),
      catchError((error) => {
        this.logger.error('CreateFloorUseCase.execute failed', {
          trace: error instanceof Error ? error.stack : undefined,
          context: 'CreateFloorUseCase',
          operation: 'execute',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        return throwError(() => error)
      })
    )
  }
}
