import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { type Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type * as winston from 'winston'
import type { Building } from '@/modules/building-management/domain/entities/building.entity'
import type { BuildingFilterDto } from '../../dto/building-filter.dto'
import type { IBuildingServicePort } from '../../ports/i-building.service'

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

@Injectable()
export class FilterBuildingsUseCase {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger,
    private readonly buildingService: IBuildingServicePort
  ) {}

  execute(filter: BuildingFilterDto): Observable<PaginatedResult<Building>> {
    const page = filter.page ?? 1
    const limit = filter.limit ?? 20
    const skip = (page - 1) * limit

    return this.buildingService.findAll(filter).pipe(
      map((buildings) => {
        const total = buildings.length
        const totalPages = Math.ceil(total / limit)
        const paginatedData = buildings.slice(skip, skip + limit)

        return {
          data: paginatedData,
          total,
          page,
          limit,
          totalPages,
        }
      }),
      catchError((error) => {
        this.logger.error('FilterBuildingsUseCase.execute failed', {
          trace: error instanceof Error ? error.stack : undefined,
          context: 'FilterBuildingsUseCase',
          operation: 'execute',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        return throwError(() => error)
      })
    )
  }
}
