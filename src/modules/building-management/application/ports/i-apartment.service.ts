import type { Observable } from 'rxjs'
import type { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import type { CreateApartmentDto } from '../dto/create-apartment.dto'

export interface BulkApartmentData {
  unitNumber: string
  totalRooms: number
  totalArea: number
  floorId: string
}

export interface IApartmentServicePort {
  create(dto: CreateApartmentDto, floorId: string): Observable<Apartment>
  bulkCreate(apartments: BulkApartmentData[]): Observable<Apartment[]>
  update(id: string, dto: Partial<CreateApartmentDto>): Observable<Apartment>
  delete(id: string): Observable<void>
  findById(id: string): Observable<Apartment | null>
  findByUniqueIdentifier(identifier: string): Observable<Apartment | null>
  findByFloorId(floorId: string): Observable<Apartment[]>
}
