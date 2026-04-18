import { Injectable } from '@nestjs/common'
import { defer, from, type Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { PrismaBaseRepository } from '@/common/repositories/prisma-base.repository'
import type { Body } from '@/modules/building-management/domain/entities/body.entity'
import type { IBodyRepository } from '@/modules/building-management/domain/interfaces/i-body.repository'
import type { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import type { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'
import { BodyMapper } from '../mappers/body.mapper'

@Injectable()
export class PrismaBodyRepository
  extends PrismaBaseRepository<Body, any, any, any, BodyId>
  implements IBodyRepository
{
  constructor(prisma: any) {
    super(prisma, 'Body')
  }

  protected getModel(): string {
    return 'body'
  }

  protected toDomain(prismaEntity: any): Body {
    return BodyMapper.toDomain(prismaEntity)
  }

  protected toPrismaCreate(entity: Body): any {
    return BodyMapper.toPrismaCreate(entity)
  }

  protected toPrismaUpdate(entity: Body): any {
    return BodyMapper.toPrismaUpdate(entity)
  }

  protected getId(entity: Body): BodyId {
    return entity.id
  }

  findByBuildingId(buildingId: BuildingId): Observable<Body[]> {
    return defer(
      () =>
        from(
          this.prisma.body.findMany({ where: { buildingId: buildingId.toString() } })
        ) as unknown as Promise<any>
    ).pipe(
      map((prismaBodies: any) => (prismaBodies as any[]).map((p) => BodyMapper.toDomain(p)))
    ) as Observable<Body[]>
  }
}
