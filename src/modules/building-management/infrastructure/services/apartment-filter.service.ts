import { Injectable } from '@nestjs/common'
import type {
  Apartment,
  ApartmentProps,
} from '@/modules/building-management/domain/entities/apartment.entity'
import { ApartmentStatus } from '@/modules/building-management/domain/enums/apartment-status.enum'

export interface ApartmentFilterDto {
  status?: ApartmentStatus
  buildingId?: string
  bodyId?: string
  floorId?: string
  minRooms?: number
  maxRooms?: number
  minArea?: number
  maxArea?: number
}

@Injectable()
export class ApartmentFilterService {
  filterApartments(apartments: Apartment[], filter: ApartmentFilterDto): Apartment[] {
    let result = apartments

    if (filter.status) {
      result = result.filter((a) => a.status === filter.status)
    }

    if (filter.minRooms) {
      result = result.filter((a) => a.totalRooms >= filter.minRooms!)
    }

    if (filter.maxRooms) {
      result = result.filter((a) => a.totalRooms <= filter.maxRooms!)
    }

    if (filter.minArea) {
      result = result.filter((a) => a.totalArea >= filter.minArea!)
    }

    if (filter.maxArea) {
      result = result.filter((a) => a.totalArea <= filter.maxArea!)
    }

    if (filter.floorId) {
      result = result.filter((a) => a.floorId.toString() === filter.floorId)
    }

    return result
  }

  getAvailableApartments(apartments: Apartment[]): Apartment[] {
    return apartments.filter((a) => a.status === ApartmentStatus.AVAILABLE)
  }

  getApartmentsByBuilding(apartments: Apartment[], buildingId: string): Apartment[] {
    return apartments
  }
}
