import { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import type { ApartmentStatus } from '@/modules/building-management/domain/enums/apartment-status.enum'
import { ApartmentId } from '@/modules/building-management/domain/value-objects/apartment-id.value-object'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { UniqueIdentifier } from '@/modules/building-management/domain/value-objects/unique-identifier.value-object'

interface PrismaApartment {
  id: string
  floorId: string
  unitNumber: string
  uniqueIdentifier: string
  totalRooms: number
  totalArea: number
  status: ApartmentStatus
}

export class ApartmentMapper {
  static toDomain(prisma: PrismaApartment): Apartment {
    const identifier = UniqueIdentifier.create(
      prisma.uniqueIdentifier.split('-')[0] || '',
      parseInt(prisma.uniqueIdentifier.split('-')[1]?.slice(0, 3) || '0', 10),
      prisma.unitNumber,
      prisma.uniqueIdentifier.includes('--') ? undefined : prisma.uniqueIdentifier.split('-')[1]
    )

    const apartment = Apartment.create(
      new FloorId(prisma.floorId),
      prisma.unitNumber,
      identifier,
      prisma.totalRooms,
      Number(prisma.totalArea)
    )
    return Object.assign(apartment, { id: new ApartmentId(prisma.id) }) as Apartment
  }

  static toPrismaCreate(apartment: Apartment): Omit<PrismaApartment, 'id'> {
    return {
      floorId: apartment.floorId.toString(),
      unitNumber: apartment.unitNumber,
      uniqueIdentifier: apartment.uniqueIdentifier.toString(),
      totalRooms: apartment.totalRooms,
      totalArea: apartment.totalArea as unknown as number,
      status: apartment.status,
    }
  }

  static toPrismaUpdate(apartment: Apartment): Omit<PrismaApartment, 'id'> {
    return {
      floorId: apartment.floorId.toString(),
      unitNumber: apartment.unitNumber,
      uniqueIdentifier: apartment.uniqueIdentifier.toString(),
      totalRooms: apartment.totalRooms,
      totalArea: apartment.totalArea as unknown as number,
      status: apartment.status,
    }
  }
}
