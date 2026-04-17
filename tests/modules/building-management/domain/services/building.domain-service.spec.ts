import { Building } from '@/modules/building-management/domain/entities/building.entity'
import { Country } from '@/modules/building-management/domain/enums/country.enum'
import { BuildingDomainService } from '@/modules/building-management/domain/services/building.domain-service'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'

describe('BuildingDomainService', () => {
  const makeBuilding = () => {
    return Building.create({
      name: 'Test Building',
      code: 'BLD001',
      address: Address.create({
        street: 'Av. Corrientes',
        number: '1234',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
      }),
      city: 'Buenos Aires',
      country: Country.ARGENTINA,
    })
  }

  const service = new BuildingDomainService()

  describe('generateIdentifier', () => {
    it('should generate identifier with body', () => {
      const building = makeBuilding()
      const identifier = service.generateIdentifier(building, 'A', 3, '01')
      expect(identifier.toString()).toBe('BLD001-A-00301')
    })

    it('should generate identifier without body', () => {
      const building = makeBuilding()
      const identifier = service.generateIdentifier(building, undefined, 3, '01')
      expect(identifier.toString()).toBe('BLD001---00301')
    })

    it('should use building code', () => {
      const building = makeBuilding()
      const identifier = service.generateIdentifier(building, undefined, 1, '01')
      expect(identifier.buildingCode).toBe('BLD001')
    })
  })

  describe('validateBuilding', () => {
    it('should return valid for complete building', () => {
      const building = makeBuilding()
      const result = service.validateBuilding(building)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return error when code is empty', () => {
      const result = service.validateBuilding(
        Object.assign(Object.create(Building.prototype), {
          props: {
            name: 'Test',
            code: '',
            city: 'Buenos Aires',
          },
        }) as Building
      )
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Building code is required')
    })

    it('should return error when city is empty', () => {
      const result = service.validateBuilding(
        Object.assign(Object.create(Building.prototype), {
          props: {
            name: 'Test',
            code: 'BLD001',
            city: '',
          },
        }) as Building
      )
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('City is required')
    })
  })

  describe('canDeleteBuilding', () => {
    it('should return true', () => {
      const building = makeBuilding()
      expect(service.canDeleteBuilding(building)).toBe(true)
    })
  })
})
