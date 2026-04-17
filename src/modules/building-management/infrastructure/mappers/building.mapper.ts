import {
  Building,
  type BuildingProps,
} from '@/modules/building-management/domain/entities/building.entity'
import type { Country } from '@/modules/building-management/domain/enums/country.enum'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'
import { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'

interface PrismaBuilding {
  id: string
  name: string
  address: string
  city: string
  country: Country
  code: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export class BuildingMapper {
  static toDomain(prisma: PrismaBuilding): Building {
    const { street, number } = BuildingMapper.parseAddress(prisma.address)

    const props: BuildingProps = {
      id: new BuildingId(prisma.id),
      name: prisma.name,
      address: Address.create({
        street,
        number,
        city: prisma.city,
        country: prisma.country,
      }),
      code: prisma.code,
      city: prisma.city,
      country: prisma.country,
      notes: prisma.notes ?? undefined,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    }
    return new Building(props)
  }

  private static parseAddress(address: string): { street: string; number: string } {
    const match = address.match(/^(.+?)\s*(\d+)$/)
    if (match) {
      return { street: match[1].trim(), number: match[2] }
    }
    return { street: address, number: '' }
  }

  static toPrismaCreate(
    building: Building
  ): Omit<PrismaBuilding, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: building.name,
      address: building.address.toString(),
      city: building.city,
      country: building.country,
      code: building.code,
      notes: building.notes ?? null,
    }
  }

  static toPrismaUpdate(
    building: Building
  ): Omit<PrismaBuilding, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: building.name,
      address: building.address.toString(),
      city: building.city,
      country: building.country,
      code: building.code,
      notes: building.notes ?? null,
    }
  }
}
