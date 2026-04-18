import type { BuildingFilterDto } from '@/modules/building-management/application/dto/building-filter.dto'
import { Building } from '@/modules/building-management/domain/entities/building.entity'
import { Country } from '@/modules/building-management/domain/enums/country.enum'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'
import { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'
import { BuildingFilterService } from '@/modules/building-management/infrastructure/services/building-filter.service'

const makeBuilding = (props: { id?: string; name?: string; city?: string; country?: Country }) => {
  return new Building({
    id: new BuildingId(props.id || 'test-id'),
    name: props.name || 'Test Building',
    address: Address.create({
      street: 'Test Street',
      number: '123',
      city: props.city || 'Buenos Aires',
      country: props.country || Country.ARGENTINA,
    }),
    code: 'BLD001',
    city: props.city || 'Buenos Aires',
    country: props.country || Country.ARGENTINA,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

describe('BuildingFilterService', () => {
  let service: BuildingFilterService

  beforeEach(() => {
    service = new BuildingFilterService()
  })

  describe('filterBuildings', () => {
    it('should filter by country', () => {
      const buildings = [
        makeBuilding({ id: '1', country: Country.ARGENTINA }),
        makeBuilding({ id: '2', country: Country.PARAGUAY }),
      ]
      const filter: BuildingFilterDto = { country: Country.ARGENTINA }

      const result = service.filterBuildings(buildings, filter)

      expect(result).toHaveLength(1)
      expect(result[0].country).toBe(Country.ARGENTINA)
    })

    it('should filter by city (case-insensitive)', () => {
      const buildings = [
        makeBuilding({ id: '1', city: 'Buenos Aires' }),
        makeBuilding({ id: '2', city: 'Asuncion' }),
      ]
      const filter: BuildingFilterDto = { city: 'buenos' }

      const result = service.filterBuildings(buildings, filter)

      expect(result).toHaveLength(1)
      expect(result[0].city).toBe('Buenos Aires')
    })

    it('should filter by name (partial match)', () => {
      const buildings = [
        makeBuilding({ id: '1', name: 'Tower A' }),
        makeBuilding({ id: '2', name: 'Tower B' }),
      ]
      const filter: BuildingFilterDto = { name: 'Tower' }

      const result = service.filterBuildings(buildings, filter)

      expect(result).toHaveLength(2)
    })
  })

  describe('paginate', () => {
    it('should paginate results', () => {
      const buildings = Array.from({ length: 50 }, (_, i) => makeBuilding({ id: `${i}` }))

      const result = service.paginate(buildings, 2, 10)

      expect(result.data).toHaveLength(10)
      expect(result.page).toBe(2)
      expect(result.total).toBe(50)
      expect(result.totalPages).toBe(5)
    })

    it('should return empty page when out of range', () => {
      const buildings = Array.from({ length: 5 }, (_, i) => makeBuilding({ id: `${i}` }))

      const result = service.paginate(buildings, 10, 10)

      expect(result.data).toHaveLength(0)
      expect(result.page).toBe(10)
    })
  })
})
