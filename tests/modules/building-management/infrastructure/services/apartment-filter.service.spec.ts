import { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import { ApartmentStatus } from '@/modules/building-management/domain/enums/apartment-status.enum'
import { ApartmentId } from '@/modules/building-management/domain/value-objects/apartment-id.value-object'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { UniqueIdentifier } from '@/modules/building-management/domain/value-objects/unique-identifier.value-object'
import { ApartmentFilterService } from '@/modules/building-management/infrastructure/services/apartment-filter.service'

interface ApartmentFilterDto {
  status?: ApartmentStatus
  buildingId?: string
  bodyId?: string
  floorId?: string
  minRooms?: number
  maxRooms?: number
  minArea?: number
  maxArea?: number
}

const makeApartment = (props: {
  id?: string
  floorId?: string
  status?: ApartmentStatus
  totalRooms?: number
  totalArea?: number
}) => {
  return new Apartment({
    id: new ApartmentId(props.id || 'apt-1'),
    floorId: new FloorId(props.floorId || 'floor-1'),
    unitNumber: '01',
    uniqueIdentifier: UniqueIdentifier.create('BLD001', 1, '01'),
    totalRooms: props.totalRooms || 2,
    totalArea: props.totalArea || 50,
    status: props.status || ApartmentStatus.AVAILABLE,
  })
}

describe('ApartmentFilterService', () => {
  let service: ApartmentFilterService

  beforeEach(() => {
    service = new ApartmentFilterService()
  })

  describe('filterApartments', () => {
    it('should filter by status', () => {
      const apartments = [
        makeApartment({ id: '1', status: ApartmentStatus.AVAILABLE }),
        makeApartment({ id: '2', status: ApartmentStatus.OCCUPIED }),
      ]
      const filter: ApartmentFilterDto = { status: ApartmentStatus.AVAILABLE }

      const result = service.filterApartments(apartments, filter)

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe(ApartmentStatus.AVAILABLE)
    })

    it('should filter by minRooms', () => {
      const apartments = [
        makeApartment({ id: '1', totalRooms: 2 }),
        makeApartment({ id: '2', totalRooms: 4 }),
      ]
      const filter: ApartmentFilterDto = { minRooms: 3 }

      const result = service.filterApartments(apartments, filter)

      expect(result).toHaveLength(1)
      expect(result[0].totalRooms).toBe(4)
    })

    it('should filter by maxRooms', () => {
      const apartments = [
        makeApartment({ id: '1', totalRooms: 2 }),
        makeApartment({ id: '2', totalRooms: 4 }),
      ]
      const filter: ApartmentFilterDto = { maxRooms: 3 }

      const result = service.filterApartments(apartments, filter)

      expect(result).toHaveLength(1)
      expect(result[0].totalRooms).toBe(2)
    })

    it('should filter by minArea', () => {
      const apartments = [
        makeApartment({ id: '1', totalArea: 50 }),
        makeApartment({ id: '2', totalArea: 100 }),
      ]
      const filter: ApartmentFilterDto = { minArea: 75 }

      const result = service.filterApartments(apartments, filter)

      expect(result).toHaveLength(1)
      expect(result[0].totalArea).toBe(100)
    })
  })

  describe('getAvailableApartments', () => {
    it('should return only available apartments', () => {
      const apartments = [
        makeApartment({ id: '1', status: ApartmentStatus.AVAILABLE }),
        makeApartment({ id: '2', status: ApartmentStatus.OCCUPIED }),
        makeApartment({ id: '3', status: ApartmentStatus.AVAILABLE }),
      ]

      const result = service.getAvailableApartments(apartments)

      expect(result).toHaveLength(2)
    })
  })
})
