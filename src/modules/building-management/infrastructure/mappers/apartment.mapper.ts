import {
  Apartment,
  type ApartmentProps,
} from '@/modules/building-management/domain/entities/apartment.entity'
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
    const parts = prisma.uniqueIdentifier.split('-')
    const buildingCode = parts[0] || ''
    const bodyName = parts.length > 2 && parts[1] !== '' ? parts[1] : undefined
    const floorNumber = parseInt(parts[parts.length - 1]?.slice(0, 3) || '0', 10)
    const unitNumber = parts[parts.length - 1]?.slice(3) || prisma.unitNumber

    const identifier = UniqueIdentifier.create(buildingCode, floorNumber, unitNumber, bodyName)

    const props: ApartmentProps = {
      id: new ApartmentId(prisma.id),
      floorId: new FloorId(prisma.floorId),
      unitNumber: prisma.unitNumber,
      uniqueIdentifier: identifier,
      totalRooms: prisma.totalRooms,
      totalArea: prisma.totalArea,
      status: prisma.status,
    }
    return new Apartment(props)
  }

  static toPrismaCreate(apartment: Apartment): Omit<PrismaApartment, 'id'> {
    return {
      floorId: apartment.floorId.toString(),
      unitNumber: apartment.unitNumber,
      uniqueIdentifier: apartment.uniqueIdentifier.toString(),
      totalRooms: apartment.totalRooms,
      totalArea: apartment.totalArea,
      status: apartment.status,
    }
  }

  static toPrismaUpdate(apartment: Apartment): Omit<PrismaApartment, 'id'> {
    return {
      floorId: apartment.floorId.toString(),
      unitNumber: apartment.unitNumber,
      uniqueIdentifier: apartment.uniqueIdentifier.toString(),
      totalRooms: apartment.totalRooms,
      totalArea: apartment.totalArea,
      status: apartment.status,
    }
  }
}
