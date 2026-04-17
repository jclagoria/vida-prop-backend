import type { Observable } from 'rxjs'
import type { Body } from '@/modules/building-management/domain/entities/body.entity'
import type { CreateBodyDto } from '../dto/create-body.dto'

export interface IBodyServicePort {
  create(buildingId: string, dto: CreateBodyDto): Observable<Body>
  delete(id: string): Observable<void>
  findById(id: string): Observable<Body | null>
  findByBuildingId(buildingId: string): Observable<Body[]>
}
