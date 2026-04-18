import type { Observable } from 'rxjs'
import type { Body } from '../entities/body.entity'
import type { BodyId } from '../value-objects/body-id.value-object'
import type { BuildingId } from '../value-objects/building-id.value-object'

export abstract class IBodyRepository {
  abstract findById(id: BodyId): Observable<Body | null>
  abstract findByBuildingId(buildingId: BuildingId): Observable<Body[]>
  abstract save(body: Body): Observable<Body>
  abstract delete(id: BodyId): Observable<void>
}
