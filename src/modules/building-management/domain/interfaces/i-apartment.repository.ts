import type { Observable } from 'rxjs'
import type { Apartment } from '../entities/apartment.entity'
import type { ApartmentStatus } from '../enums/apartment-status.enum'
import type { ApartmentId } from '../value-objects/apartment-id.value-object'
import type { FloorId } from '../value-objects/floor-id.value-object'

export interface ApartmentFilter {
  floorId?: FloorId
  status?: ApartmentStatus
}

export abstract class IApartmentRepository {
  abstract findById(id: ApartmentId): Observable<Apartment | null>
  abstract findAll(filter?: ApartmentFilter): Observable<Apartment[]>
  abstract save(apartment: Apartment): Observable<Apartment>
  abstract delete(id: ApartmentId): Observable<void>
  abstract findByUniqueIdentifier(uniqueIdentifier: string): Observable<Apartment | null>
}
