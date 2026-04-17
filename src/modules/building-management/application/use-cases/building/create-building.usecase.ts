import { Injectable, Logger } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { Building } from '@/modules/building-management/domain/entities/building.entity'
import type { BuildingDomainService } from '@/modules/building-management/domain/services/building.domain-service'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'
import type { CreateBuildingDto } from '../../dto/create-building.dto'
import type { IBuildingServicePort } from '../../ports/i-building.service'

@Injectable()
export class CreateBuildingUseCase {
  private readonly logger = new Logger(CreateBuildingUseCase.name)

  constructor(
    private readonly buildingService: IBuildingServicePort,
    private readonly domainService: BuildingDomainService
  ) {}

  execute(dto: CreateBuildingDto): Observable<Building> {
    return new Observable<Building>((subscriber) => {
      try {
        const address = Address.create({
          street: dto.address,
          number: '',
          city: dto.city,
          country: dto.country,
        })

        const building = Building.create({
          name: dto.name,
          address,
          code: dto.code,
          city: dto.city,
          country: dto.country,
          notes: dto.notes,
        })

        const validation = this.domainService.validateBuilding(building)
        if (!validation.valid) {
          subscriber.error(new Error(validation.errors.join(', ')))
          return
        }

        subscriber.next(building)
      } catch (error) {
        subscriber.error(error)
      }
    }).pipe(
      switchMap((building) => this.buildingService.create(dto)),
      catchError((error) => {
        this.logger.error(
          'CreateBuildingUseCase.execute failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'CreateBuildingUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        return throwError(() => error)
      })
    )
  }
}
