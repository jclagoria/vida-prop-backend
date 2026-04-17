import { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import { ApartmentStatus } from '@/modules/building-management/domain/enums/apartment-status.enum'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { UniqueIdentifier } from '@/modules/building-management/domain/value-objects/unique-identifier.value-object'

describe('Apartment Entity', () => {
  const makeFloorId = () => new FloorId('floor-uuid')
  const makeUniqueIdentifier = () => UniqueIdentifier.create('BLD001', 1, '01', 'A')

  const makeApartment = (
    props?: Partial<{
      floorId: FloorId
      unitNumber: string
      uniqueIdentifier: UniqueIdentifier
      totalRooms: number
      totalArea: number
    }>
  ) => {
    return Apartment.create(
      props?.floorId ?? makeFloorId(),
      props?.unitNumber ?? '01',
      props?.uniqueIdentifier ?? makeUniqueIdentifier(),
      props?.totalRooms ?? 2,
      props?.totalArea ?? 50
    )
  }

  describe('create', () => {
    it('should create apartment with all required fields', () => {
      const apartment = makeApartment()
      expect(apartment.unitNumber).toBe('01')
      expect(apartment.totalRooms).toBe(2)
      expect(apartment.totalArea).toBe(50)
      expect(apartment.status).toBe(ApartmentStatus.AVAILABLE)
    })

    it('should generate UUID for id', () => {
      const apartment = makeApartment()
      expect(apartment.id.toString()).toBeDefined()
    })

    it('should reject missing floor id', () => {
      expect(() =>
        Apartment.create(undefined as unknown as FloorId, '01', makeUniqueIdentifier(), 2, 50)
      ).toThrow('FloorId is required')
    })

    it('should reject empty unit number', () => {
      expect(() => Apartment.create(makeFloorId(), '', makeUniqueIdentifier(), 2, 50)).toThrow(
        'Unit number is required'
      )
    })

    it('should reject negative total rooms', () => {
      expect(() => Apartment.create(makeFloorId(), '01', makeUniqueIdentifier(), -1, 50)).toThrow(
        'Total rooms must be a non-negative integer'
      )
    })

    it('should reject zero total area', () => {
      expect(() => Apartment.create(makeFloorId(), '01', makeUniqueIdentifier(), 2, 0)).toThrow(
        'Total area must be greater than zero'
      )
    })

    it('should reject negative total area', () => {
      expect(() => Apartment.create(makeFloorId(), '01', makeUniqueIdentifier(), 2, -10)).toThrow(
        'Total area must be greater than zero'
      )
    })
  })

  describe('status transitions', () => {
    it('should transition from AVAILABLE to OCCUPIED', () => {
      const apartment = makeApartment()
      const occupied = apartment.occupy()
      expect(occupied.status).toBe(ApartmentStatus.OCCUPIED)
    })

    it('should transition from OCCUPIED to AVAILABLE', () => {
      const apartment = makeApartment().occupy()
      const vacated = apartment.vacate()
      expect(vacated.status).toBe(ApartmentStatus.AVAILABLE)
    })

    it('should transition to MAINTENANCE from any status', () => {
      const available = makeApartment().setMaintenance()
      expect(available.status).toBe(ApartmentStatus.MAINTENANCE)

      const occupied = makeApartment().occupy().setMaintenance()
      expect(occupied.status).toBe(ApartmentStatus.MAINTENANCE)
    })

    it('should transition from AVAILABLE to UNAVAILABLE', () => {
      const apartment = makeApartment()
      const unavailable = apartment.setUnavailable()
      expect(unavailable.status).toBe(ApartmentStatus.UNAVAILABLE)
    })

    it('should transition from OCCUPIED to UNAVAILABLE', () => {
      const apartment = makeApartment().occupy()
      const unavailable = apartment.setUnavailable()
      expect(unavailable.status).toBe(ApartmentStatus.UNAVAILABLE)
    })

    it('should reject transition from UNAVAILABLE to OCCUPIED', () => {
      const apartment = makeApartment().setUnavailable()
      expect(() => apartment.occupy()).toThrow('Cannot transition from UNAVAILABLE to OCCUPIED')
    })

    it('should reject transition from UNAVAILABLE to AVAILABLE', () => {
      const apartment = makeApartment().setUnavailable()
      expect(() => apartment.setAvailable()).toThrow(
        'Cannot transition from UNAVAILABLE to AVAILABLE'
      )
    })

    it('should reject direct transition from OCCUPIED to UNVAILABLE', () => {
      const apartment = makeApartment().occupy()
      expect(() => apartment.setUnavailable()).not.toThrow()
    })
  })

  describe('equals', () => {
    it('should return false for different id', () => {
      const apartment1 = makeApartment()
      const apartment2 = makeApartment()
      expect(apartment1.equals(apartment2)).toBe(false)
    })
  })

  describe('toPlain', () => {
    it('should return plain object', () => {
      const apartment = makeApartment()
      const plain = apartment.toPlain()
      expect(plain.id).toBeDefined()
      expect(plain.floorId).toBeDefined()
      expect(plain.unitNumber).toBe('01')
      expect(plain.totalRooms).toBe(2)
      expect(plain.totalArea).toBe(50)
      expect(plain.status).toBe(ApartmentStatus.AVAILABLE)
    })
  })
})
