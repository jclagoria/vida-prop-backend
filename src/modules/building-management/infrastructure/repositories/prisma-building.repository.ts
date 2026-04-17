import { Injectable } from '@nestjs/common'
import { defer, from, type Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import type { Building } from '@/modules/building-management/domain/entities/building.entity'
import type {
  BuildingFilter,
  IBuildingRepository,
} from '@/modules/building-management/domain/interfaces/i-building.repository'
import type { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'
import { BuildingMapper } from '../mappers/building.mapper'

@Injectable()
export class PrismaBuildingRepository implements IBuildingRepository {
  private prisma: any

  constructor(prisma: any) {
    this.prisma = prisma
  }

  findById(id: BuildingId): Observable<Building | null> {
    return defer(() =>
      from(this.prisma.building.findUnique({ where: { id: id.toString() } }))
    ).pipe(
      map((prismaBuilding: any) =>
        prismaBuilding ? BuildingMapper.toDomain(prismaBuilding) : null
      ),
      shareReplay(1)
    )
  }

  findAll(filter?: BuildingFilter): Observable<Building[]> {
    return defer(() =>
      from(this.prisma.building.findMany({ where: filter }) as unknown as Promise<any>)
    ).pipe(
      map((prismaBuildings: any) =>
        (prismaBuildings as any[]).map((p) => BuildingMapper.toDomain(p))
      )
    ) as Observable<Building[]>
  }

  save(building: Building): Observable<Building> {
    const data = BuildingMapper.toPrismaCreate(building)
    return defer(() =>
      from(
        this.prisma.building.create({
          data,
        })
      )
    ).pipe(map((prismaBuilding: any) => BuildingMapper.toDomain(prismaBuilding)))
  }

  delete(id: BuildingId): Observable<void> {
    return defer(() => from(this.prisma.building.delete({ where: { id: id.toString() } }))).pipe(
      map(() => undefined)
    )
  }
}
