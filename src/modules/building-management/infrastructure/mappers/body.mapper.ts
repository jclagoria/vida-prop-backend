import { Body, type BodyProps } from '@/modules/building-management/domain/entities/body.entity'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'

interface PrismaBody {
  id: string
  buildingId: string
  name: string
}

export class BodyMapper {
  static toDomain(prisma: PrismaBody): Body {
    const props: BodyProps = {
      id: new BodyId(prisma.id),
      buildingId: new BuildingId(prisma.buildingId),
      name: prisma.name,
    }
    return new Body(props)
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
