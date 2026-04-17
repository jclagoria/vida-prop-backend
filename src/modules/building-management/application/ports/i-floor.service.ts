import type { Observable } from 'rxjs'
import type { Floor } from '@/modules/building-management/domain/entities/floor.entity'
import type { CreateFloorDto } from '../dto/create-floor.dto'

export interface IFloorServicePort {
  create(bodyId: string, dto: CreateFloorDto): Observable<Floor>
  delete(id: string): Observable<void>
  findById(id: string): Observable<Floor | null>
  findByBodyId(bodyId: string): Observable<Floor[]>
}
