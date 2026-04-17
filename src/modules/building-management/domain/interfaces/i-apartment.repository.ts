import type { Observable } from 'rxjs'
import type { Apartment } from '../entities/apartment.entity'
import type { ApartmentStatus } from '../enums/apartment-status.enum'
import type { ApartmentId } from '../value-objects/apartment-id.value-object'
import type { FloorId } from '../value-objects/floor-id.value-object'

export interface ApartmentFilter {
  floorId?: FloorId
  status?: ApartmentStatus
}

export interface IApartmentRepository {
  findById(id: ApartmentId): Observable<Apartment | null>
  findAll(filter?: ApartmentFilter): Observable<Apartment[]>
  save(apartment: Apartment): Observable<Apartment>
  delete(id: ApartmentId): Observable<void>
  findByUniqueIdentifier(uniqueIdentifier: string): Observable<Apartment | null>
}
