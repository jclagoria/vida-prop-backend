import { Injectable } from '@nestjs/common'
import { defer, from, type Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import type { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import type {
  ApartmentFilter,
  IApartmentRepository,
} from '@/modules/building-management/domain/interfaces/i-apartment.repository'
import type { ApartmentId } from '@/modules/building-management/domain/value-objects/apartment-id.value-object'
import type { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { ApartmentMapper } from '../mappers/apartment.mapper'

@Injectable()
export class PrismaApartmentRepository implements IApartmentRepository {
  private prisma: any

  constructor(prisma: any) {
    this.prisma = prisma
  }

  findById(id: ApartmentId): Observable<Apartment | null> {
    return defer(() =>
      from(this.prisma.apartment.findUnique({ where: { id: id.toString() } }))
    ).pipe(
      map((prismaApartment: any) =>
        prismaApartment ? ApartmentMapper.toDomain(prismaApartment) : null
      ),
      shareReplay(1)
    )
  }

  findAll(filter?: ApartmentFilter): Observable<Apartment[]> {
    return defer(
      () => from(this.prisma.apartment.findMany({ where: filter })) as unknown as Promise<any>
    ).pipe(
      map((prismaApartments: any) =>
        (prismaApartments as any[]).map((p) => ApartmentMapper.toDomain(p))
      )
    ) as Observable<Apartment[]>
  }

  findByUniqueIdentifier(uniqueIdentifier: string): Observable<Apartment | null> {
    return defer(() =>
      from(this.prisma.apartment.findUnique({ where: { uniqueIdentifier } }))
    ).pipe(
      map((prismaApartment: any) =>
        prismaApartment ? ApartmentMapper.toDomain(prismaApartment) : null
      ),
      shareReplay(1)
    )
  }

  findByFloorId(floorId: FloorId): Observable<Apartment[]> {
    return defer(
      () =>
        from(
          this.prisma.apartment.findMany({ where: { floorId: floorId.toString() } })
        ) as unknown as Promise<any>
    ).pipe(
      map((prismaApartments: any) =>
        (prismaApartments as any[]).map((p) => ApartmentMapper.toDomain(p))
      )
    ) as Observable<Apartment[]>
  }

  save(apartment: Apartment): Observable<Apartment> {
    const data = ApartmentMapper.toPrismaCreate(apartment)
    return defer(() => from(this.prisma.apartment.create({ data }))).pipe(
      map((prismaApartment: any) => ApartmentMapper.toDomain(prismaApartment))
    )
  }

  delete(id: ApartmentId): Observable<void> {
    return defer(() => from(this.prisma.apartment.delete({ where: { id: id.toString() } }))).pipe(
      map(() => undefined)
    )
  }

  bulkCreate(apartments: any[]): Observable<Apartment[]> {
    return defer(
      () =>
        from(
          this.prisma.$transaction(apartments.map((data) => this.prisma.apartment.create({ data })))
        ) as unknown as Promise<any>
    ).pipe(
      map((results: any) => (results as any[]).map((r) => ApartmentMapper.toDomain(r)))
    ) as Observable<Apartment[]>
  }
}
