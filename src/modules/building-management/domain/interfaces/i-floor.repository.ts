import type { Observable } from 'rxjs'
import type { Floor } from '../entities/floor.entity'
import type { BodyId } from '../value-objects/body-id.value-object'
import type { FloorId } from '../value-objects/floor-id.value-object'

export abstract class IFloorRepository {
  abstract findById(id: FloorId): Observable<Floor | null>
  abstract findByBodyId(bodyId: BodyId): Observable<Floor[]>
  abstract save(floor: Floor): Observable<Floor>
  abstract delete(id: FloorId): Observable<void>
}
