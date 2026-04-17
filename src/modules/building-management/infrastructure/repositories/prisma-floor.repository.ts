import { Injectable } from '@nestjs/common'
import { defer, from, type Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import type { Floor } from '@/modules/building-management/domain/entities/floor.entity'
import type { IFloorRepository } from '@/modules/building-management/domain/interfaces/i-floor.repository'
import type { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import type { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { FloorMapper } from '../mappers/floor.mapper'

@Injectable()
export class PrismaFloorRepository implements IFloorRepository {
  private prisma: any

  constructor(prisma: any) {
    this.prisma = prisma
  }

  findById(id: FloorId): Observable<Floor | null> {
    return defer(() => from(this.prisma.floor.findUnique({ where: { id: id.toString() } }))).pipe(
      map((prismaFloor: any) => (prismaFloor ? FloorMapper.toDomain(prismaFloor) : null)),
      shareReplay(1)
    )
  }

  findByBodyId(bodyId: BodyId): Observable<Floor[]> {
    return defer(
      () =>
        from(
          this.prisma.floor.findMany({ where: { bodyId: bodyId.toString() } })
        ) as unknown as Promise<any>
    ).pipe(
      map((prismaFloors: any) => (prismaFloors as any[]).map((p) => FloorMapper.toDomain(p)))
    ) as Observable<Floor[]>
  }

  save(floor: Floor): Observable<Floor> {
    const data = FloorMapper.toPrismaCreate(floor)
    return defer(() => from(this.prisma.floor.create({ data }))).pipe(
      map((prismaFloor: any) => FloorMapper.toDomain(prismaFloor))
    )
  }

  delete(id: FloorId): Observable<void> {
    return defer(() => from(this.prisma.floor.delete({ where: { id: id.toString() } }))).pipe(
      map(() => undefined)
    )
  }
}
