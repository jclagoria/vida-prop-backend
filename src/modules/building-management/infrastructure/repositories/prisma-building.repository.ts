import { Injectable } from '@nestjs/common'
import { defer, from, type Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { PrismaBaseRepository } from '@/common/repositories/prisma-base.repository'
import type { Building } from '@/modules/building-management/domain/entities/building.entity'
import type {
  BuildingFilter,
  IBuildingRepository,
} from '@/modules/building-management/domain/interfaces/i-building.repository'
import type { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'
import { BuildingMapper } from '../mappers/building.mapper'

@Injectable()
export class PrismaBuildingRepository
  extends PrismaBaseRepository<Building, any, any, any, BuildingId>
  implements IBuildingRepository
{
  constructor(prisma: any) {
    super(prisma, 'Building')
  }

  protected getModel(): string {
    return 'building'
  }

  protected toDomain(prismaEntity: any): Building {
    return BuildingMapper.toDomain(prismaEntity)
  }

  protected toPrismaCreate(entity: Building): any {
    return BuildingMapper.toPrismaCreate(entity)
  }

  protected toPrismaUpdate(entity: Building): any {
    return BuildingMapper.toPrismaUpdate(entity)
  }

  protected getId(entity: Building): BuildingId {
    return entity.id
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
}
