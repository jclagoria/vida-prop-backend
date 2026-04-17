import type { Observable } from 'rxjs'
import type { Building } from '../entities/building.entity'
import type { BuildingId } from '../value-objects/building-id.value-object'

export interface BuildingFilter {
  city?: string
  country?: string
}

export interface IBuildingRepository {
  findById(id: BuildingId): Observable<Building | null>
  findAll(filter?: BuildingFilter): Observable<Building[]>
  save(building: Building): Observable<Building>
  delete(id: BuildingId): Observable<void>
}
