import type { Observable } from 'rxjs'
import type { Building } from '@/modules/building-management/domain/entities/building.entity'
import type { BuildingFilterDto } from '../dto/building-filter.dto'
import type { CreateBuildingDto } from '../dto/create-building.dto'

export interface IBuildingServicePort {
  create(dto: CreateBuildingDto): Observable<Building>
  update(id: string, dto: Partial<CreateBuildingDto>): Observable<Building>
  delete(id: string): Observable<void>
  findById(id: string): Observable<Building | null>
  findByCode(code: string): Observable<Building | null>
  findAll(filter?: BuildingFilterDto): Observable<Building[]>
}
