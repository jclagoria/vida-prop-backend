import type { Observable } from 'rxjs'
import type { Body } from '../entities/body.entity'
import type { BodyId } from '../value-objects/body-id.value-object'
import type { BuildingId } from '../value-objects/building-id.value-object'

export interface IBodyRepository {
  findById(id: BodyId): Observable<Body | null>
  findByBuildingId(buildingId: BuildingId): Observable<Body[]>
  save(body: Body): Observable<Body>
  delete(id: BodyId): Observable<void>
}
