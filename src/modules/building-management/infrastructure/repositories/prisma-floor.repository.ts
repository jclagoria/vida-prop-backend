import { Injectable } from '@nestjs/common'
import { defer, from, type Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { PrismaBaseRepository } from '@/common/repositories/prisma-base.repository'
import type { Floor } from '@/modules/building-management/domain/entities/floor.entity'
import type { IFloorRepository } from '@/modules/building-management/domain/interfaces/i-floor.repository'
import type { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import type { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { FloorMapper } from '../mappers/floor.mapper'

@Injectable()
export class PrismaFloorRepository
  extends PrismaBaseRepository<Floor, any, any, any, FloorId>
  implements IFloorRepository
{
  constructor(prisma: any) {
    super(prisma, 'Floor')
  }

  protected getModel(): string {
    return 'floor'
  }

  protected toDomain(prismaEntity: any): Floor {
    return FloorMapper.toDomain(prismaEntity)
  }

  protected toPrismaCreate(entity: Floor): any {
    return FloorMapper.toPrismaCreate(entity)
  }

  protected toPrismaUpdate(entity: Floor): any {
    return FloorMapper.toPrismaUpdate(entity)
  }

  protected getId(entity: Floor): FloorId {
    return entity.id
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
}
