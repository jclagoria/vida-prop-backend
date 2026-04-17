import type { Apartment } from '../entities/apartment.entity'
import { ApartmentStatus } from '../enums/apartment-status.enum'

export interface RentCalculation {
  baseRent: number
  totalArea: number
  ratePerSqm: number
  finalRent: number
}

export class ApartmentDomainService {
  calculateRent(apartment: Apartment, ratePerSqm: number): RentCalculation {
    const baseRent = apartment.totalArea * ratePerSqm
    return {
      baseRent,
      totalArea: apartment.totalArea,
      ratePerSqm,
      finalRent: baseRent,
    }
  }

  isAvailableForLease(apartment: Apartment): boolean {
    return apartment.status === ApartmentStatus.AVAILABLE
  }

  validateStatusTransition(current: ApartmentStatus, next: ApartmentStatus): boolean {
    const validTransitions: Record<ApartmentStatus, ApartmentStatus[]> = {
      [ApartmentStatus.AVAILABLE]: [
        ApartmentStatus.OCCUPIED,
        ApartmentStatus.MAINTENANCE,
        ApartmentStatus.UNAVAILABLE,
      ],
      [ApartmentStatus.OCCUPIED]: [
        ApartmentStatus.AVAILABLE,
        ApartmentStatus.MAINTENANCE,
        ApartmentStatus.UNAVAILABLE,
      ],
      [ApartmentStatus.MAINTENANCE]: [
        ApartmentStatus.AVAILABLE,
        ApartmentStatus.OCCUPIED,
        ApartmentStatus.UNAVAILABLE,
      ],
      [ApartmentStatus.UNAVAILABLE]: [ApartmentStatus.MAINTENANCE],
    }

    return validTransitions[current]?.includes(next) ?? false
  }
}
