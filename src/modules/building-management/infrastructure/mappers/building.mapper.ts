import { Building } from '@/modules/building-management/domain/entities/building.entity'
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
    const building = Building.create({
      name: prisma.name,
      address: Address.create({
        street: prisma.address,
        number: '',
        city: prisma.city,
        country: prisma.country,
      }),
      code: prisma.code,
      city: prisma.city,
      country: prisma.country,
      notes: prisma.notes ?? undefined,
    })

    return Object.assign(building, { id: new BuildingId(prisma.id) }) as Building
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
