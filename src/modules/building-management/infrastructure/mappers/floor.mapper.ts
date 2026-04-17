import { Floor, type FloorProps } from '@/modules/building-management/domain/entities/floor.entity'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'

interface PrismaFloor {
  id: string
  bodyId: string
  floorNumber: number
}

export class FloorMapper {
  static toDomain(prisma: PrismaFloor): Floor {
    const props: FloorProps = {
      id: new FloorId(prisma.id),
      bodyId: new BodyId(prisma.bodyId),
      floorNumber: prisma.floorNumber,
    }
    return new Floor(props)
  }

  static toPrismaCreate(floor: Floor): Omit<PrismaFloor, 'id'> {
    return {
      bodyId: floor.bodyId.toString(),
      floorNumber: floor.floorNumber,
    }
  }

  static toPrismaUpdate(floor: Floor): Omit<PrismaFloor, 'id'> {
    return {
      bodyId: floor.bodyId.toString(),
      floorNumber: floor.floorNumber,
    }
  }
}
