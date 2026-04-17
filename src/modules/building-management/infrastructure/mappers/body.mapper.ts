import { Body } from '@/modules/building-management/domain/entities/body.entity'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'

interface PrismaBody {
  id: string
  buildingId: string
  name: string
}

export class BodyMapper {
  static toDomain(prisma: PrismaBody): Body {
    const body = Body.create(new BuildingId(prisma.buildingId), prisma.name)
    return Object.assign(body, { id: new BodyId(prisma.id) }) as Body
  }

  static toPrismaCreate(body: Body): Omit<PrismaBody, 'id'> {
    return {
      buildingId: body.buildingId.toString(),
      name: body.name,
    }
  }

  static toPrismaUpdate(body: Body): Omit<PrismaBody, 'id'> {
    return {
      buildingId: body.buildingId.toString(),
      name: body.name,
    }
  }
}
