import type { Observable } from 'rxjs'
import type { Floor } from '../entities/floor.entity'
import type { BodyId } from '../value-objects/body-id.value-object'
import type { FloorId } from '../value-objects/floor-id.value-object'

export interface IFloorRepository {
  findById(id: FloorId): Observable<Floor | null>
  findByBodyId(bodyId: BodyId): Observable<Floor[]>
  save(floor: Floor): Observable<Floor>
  delete(id: FloorId): Observable<void>
}
