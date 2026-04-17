import { Injectable, Logger } from '@nestjs/common'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type { Building } from '@/modules/building-management/domain/entities/building.entity'
import type { BuildingDomainService } from '@/modules/building-management/domain/services/building.domain-service'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'
import type { CreateBuildingDto } from '../../dto/create-building.dto'
import type { IBuildingServicePort } from '../../ports/i-building.service'

@Injectable()
export class UpdateBuildingUseCase {
  private readonly logger = new Logger(UpdateBuildingUseCase.name)

  constructor(
    private readonly buildingService: IBuildingServicePort,
    private readonly domainService: BuildingDomainService
  ) {}

  execute(id: string, dto: Partial<CreateBuildingDto>): Observable<Building> {
    return this.buildingService.findById(id).pipe(
      switchMap((existing) => {
        if (!existing) {
          return throwError(() => new Error('Building not found'))
        }

        const address = dto.address
          ? Address.create({
              street: dto.address,
              number: '',
              city: dto.city ?? existing.city,
              country: dto.country ?? existing.country,
            })
          : existing.address

        const updated = existing.update({
          name: dto.name,
          address,
          code: dto.code,
          city: dto.city,
          notes: dto.notes,
        })

        const validation = this.domainService.validateBuilding(updated)
        if (!validation.valid) {
          return throwError(() => new Error(validation.errors.join(', ')))
        }

        return this.buildingService.update(id, dto)
      }),
      catchError((error) => {
        this.logger.error(
          'UpdateBuildingUseCase.execute failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'UpdateBuildingUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        return throwError(() => error)
      })
    )
  }
}
