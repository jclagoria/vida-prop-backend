import type { Observable } from 'rxjs'
import type { Building } from '../entities/building.entity'
import type { BuildingId } from '../value-objects/building-id.value-object'

export interface BuildingFilter {
  city?: string
  country?: string
}

export abstract class IBuildingRepository {
  abstract findById(id: BuildingId): Observable<Building | null>
  abstract findAll(filter?: BuildingFilter): Observable<Building[]>
  abstract save(building: Building): Observable<Building>
  abstract delete(id: BuildingId): Observable<void>
}
