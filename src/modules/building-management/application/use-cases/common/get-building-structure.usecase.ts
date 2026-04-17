import { Injectable, Logger } from '@nestjs/common'
import { Observable, type Observable as ObservableType, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type { IApartmentServicePort } from '../../ports/i-apartment.service'
import type { IBodyServicePort } from '../../ports/i-body.service'
import type { IBuildingServicePort } from '../../ports/i-building.service'

export interface BuildingStructure {
  id: string
  name: string
  code: string
  bodies: {
    id: string
    name: string
    floors: {
      id: string
      floorNumber: number
      apartments: {
        id: string
        unitNumber: string
        uniqueIdentifier: string
        totalRooms: number
        totalArea: number
        status: string
      }[]
    }[]
  }[]
}

@Injectable()
export class GetBuildingStructureUseCase {
  private readonly logger = new Logger(GetBuildingStructureUseCase.name)

  constructor(
    private readonly buildingService: IBuildingServicePort,
    private readonly bodyService: IBodyServicePort
  ) {}

  execute(buildingId: string): Observable<BuildingStructure> {
    return this.buildingService.findById(buildingId).pipe(
      switchMap((building) => {
        if (!building) {
          return throwError(() => new Error('Building not found'))
        }

        return this.bodyService.findByBuildingId(buildingId).pipe(
          switchMap((bodies) => {
            const structure: BuildingStructure = {
              id: building.id.toString(),
              name: building.name,
              code: building.code,
              bodies: [],
            }

            if (!bodies || bodies.length === 0) {
              return new Observable<BuildingStructure>((subscriber) => subscriber.next(structure))
            }

            return new Observable<BuildingStructure>((subscriber) => {
              subscriber.next(structure)
              subscriber.complete()
            })
          })
        )
      }),
      catchError((error) => {
        this.logger.error(
          'GetBuildingStructureUseCase.execute failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'GetBuildingStructureUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        return throwError(() => error)
      })
    )
  }
}
