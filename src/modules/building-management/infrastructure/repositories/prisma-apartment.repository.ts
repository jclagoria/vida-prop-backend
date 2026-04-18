import { Injectable } from '@nestjs/common'
import { defer, from, type Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { PrismaBaseRepository } from '@/common/repositories/prisma-base.repository'
import type { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import type {
  ApartmentFilter,
  IApartmentRepository,
} from '@/modules/building-management/domain/interfaces/i-apartment.repository'
import type { ApartmentId } from '@/modules/building-management/domain/value-objects/apartment-id.value-object'
import type { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { ApartmentMapper } from '../mappers/apartment.mapper'

@Injectable()
export class PrismaApartmentRepository
  extends PrismaBaseRepository<Apartment, any, any, any, ApartmentId>
  implements IApartmentRepository
{
  constructor(prisma: any) {
    super(prisma, 'Apartment')
  }

  protected getModel(): string {
    return 'apartment'
  }

  protected toDomain(prismaEntity: any): Apartment {
    return ApartmentMapper.toDomain(prismaEntity)
  }

  protected toPrismaCreate(entity: Apartment): any {
    return ApartmentMapper.toPrismaCreate(entity)
  }

  protected toPrismaUpdate(entity: Apartment): any {
    return ApartmentMapper.toPrismaUpdate(entity)
  }

  protected getId(entity: Apartment): ApartmentId {
    return entity.id
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
}
