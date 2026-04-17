import { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import { ApartmentStatus } from '@/modules/building-management/domain/enums/apartment-status.enum'
import { ApartmentDomainService } from '@/modules/building-management/domain/services/apartment.domain-service'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { UniqueIdentifier } from '@/modules/building-management/domain/value-objects/unique-identifier.value-object'

describe('ApartmentDomainService', () => {
  const makeFloorId = () => new FloorId('floor-uuid')
  const makeUniqueIdentifier = () => UniqueIdentifier.create('BLD001', 1, '01', 'A')

  const makeApartment = (status: ApartmentStatus = ApartmentStatus.AVAILABLE) => {
    const apartment = Apartment.create(makeFloorId(), '01', makeUniqueIdentifier(), 2, 50)
    return status === ApartmentStatus.AVAILABLE
      ? apartment
      : status === ApartmentStatus.OCCUPIED
        ? apartment.occupy()
        : status === ApartmentStatus.MAINTENANCE
          ? apartment.setMaintenance()
          : apartment.setUnavailable()
  }

  const service = new ApartmentDomainService()

  describe('calculateRent', () => {
    it('should calculate rent based on area and rate', () => {
      const apartment = makeApartment()
      const result = service.calculateRent(apartment, 10)
      expect(result.baseRent).toBe(500)
      expect(result.totalArea).toBe(50)
      expect(result.ratePerSqm).toBe(10)
      expect(result.finalRent).toBe(500)
    })

    it('should calculate rent with different rate', () => {
      const apartment = makeApartment()
      const result = service.calculateRent(apartment, 15)
      expect(result.baseRent).toBe(750)
    })
  })

  describe('isAvailableForLease', () => {
    it('should return true for AVAILABLE status', () => {
      const apartment = makeApartment(ApartmentStatus.AVAILABLE)
      expect(service.isAvailableForLease(apartment)).toBe(true)
    })

    it('should return false for OCCUPIED status', () => {
      const apartment = makeApartment(ApartmentStatus.OCCUPIED)
      expect(service.isAvailableForLease(apartment)).toBe(false)
    })

    it('should return false for MAINTENANCE status', () => {
      const apartment = makeApartment(ApartmentStatus.MAINTENANCE)
      expect(service.isAvailableForLease(apartment)).toBe(false)
    })

    it('should return false for UNAVAILABLE status', () => {
      const apartment = makeApartment(ApartmentStatus.UNAVAILABLE)
      expect(service.isAvailableForLease(apartment)).toBe(false)
    })
  })

  describe('validateStatusTransition', () => {
    it('should allow AVAILABLE to OCCUPIED', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.AVAILABLE, ApartmentStatus.OCCUPIED)
      ).toBe(true)
    })

    it('should allow AVAILABLE to MAINTENANCE', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.AVAILABLE, ApartmentStatus.MAINTENANCE)
      ).toBe(true)
    })

    it('should allow AVAILABLE to UNAVAILABLE', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.AVAILABLE, ApartmentStatus.UNAVAILABLE)
      ).toBe(true)
    })

    it('should allow OCCUPIED to AVAILABLE', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.OCCUPIED, ApartmentStatus.AVAILABLE)
      ).toBe(true)
    })

    it('should allow OCCUPIED to MAINTENANCE', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.OCCUPIED, ApartmentStatus.MAINTENANCE)
      ).toBe(true)
    })

    it('should allow OCCUPIED to UNAVAILABLE', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.OCCUPIED, ApartmentStatus.UNAVAILABLE)
      ).toBe(true)
    })

    it('should allow MAINTENANCE to AVAILABLE', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.MAINTENANCE, ApartmentStatus.AVAILABLE)
      ).toBe(true)
    })

    it('should allow MAINTENANCE to OCCUPIED', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.MAINTENANCE, ApartmentStatus.OCCUPIED)
      ).toBe(true)
    })

    it('should allow MAINTENANCE to UNAVAILABLE', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.MAINTENANCE, ApartmentStatus.UNAVAILABLE)
      ).toBe(true)
    })

    it('should allow UNAVAILABLE to MAINTENANCE only', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.UNAVAILABLE, ApartmentStatus.MAINTENANCE)
      ).toBe(true)
    })

    it('should reject UNAVAILABLE to OCCUPIED', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.UNAVAILABLE, ApartmentStatus.OCCUPIED)
      ).toBe(false)
    })

    it('should reject UNAVAILABLE to AVAILABLE', () => {
      expect(
        service.validateStatusTransition(ApartmentStatus.UNAVAILABLE, ApartmentStatus.AVAILABLE)
      ).toBe(false)
    })
  })
})
