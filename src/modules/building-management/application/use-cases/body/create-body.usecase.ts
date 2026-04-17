import { Injectable, Logger } from '@nestjs/common'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { Body } from '@/modules/building-management/domain/entities/body.entity'
import type { CreateBodyDto } from '../../dto/create-body.dto'
import type { IBodyServicePort } from '../../ports/i-body.service'
import type { IBuildingServicePort } from '../../ports/i-building.service'

@Injectable()
export class CreateBodyUseCase {
  private readonly logger = new Logger(CreateBodyUseCase.name)

  constructor(
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
        this.logger.error(
          'CreateBodyUseCase.execute failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'CreateBodyUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        return throwError(() => error)
      })
    )
  }
}
