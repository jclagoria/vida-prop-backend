import { Building } from '@/modules/building-management/domain/entities/building.entity'
import { Country } from '@/modules/building-management/domain/enums/country.enum'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'

describe('Building Entity', () => {
  const makeAddress = () => {
    return Address.create({
      street: 'Av. Corrientes',
      number: '1234',
      city: 'Buenos Aires',
      country: Country.ARGENTINA,
    })
  }

  const makeBuilding = (
    props?: Partial<{ name: string; code: string; city: string; country: Country }>
  ) => {
    return Building.create({
      name: props?.name ?? 'Test Building',
      code: props?.code ?? 'BLD001',
      address: makeAddress(),
      city: props?.city ?? 'Buenos Aires',
      country: props?.country ?? Country.ARGENTINA,
    })
  }

  describe('create', () => {
    it('should create building with all required fields', () => {
      const building = makeBuilding()
      expect(building.name).toBe('Test Building')
      expect(building.code).toBe('BLD001')
      expect(building.city).toBe('Buenos Aires')
      expect(building.country).toBe(Country.ARGENTINA)
    })

    it('should generate UUID for id', () => {
      const building = makeBuilding()
      expect(building.id.toString()).toBeDefined()
    })

    it('should uppercase building code', () => {
      const building = makeBuilding({ code: 'bld001' })
      expect(building.code).toBe('BLD001')
    })

    it('should trim building name', () => {
      const building = makeBuilding({ name: '  Test Building  ' })
      expect(building.name).toBe('Test Building')
    })

    it('should reject empty name', () => {
      expect(() => makeBuilding({ name: '' })).toThrow('Building name is required')
    })

    it('should reject empty code', () => {
      expect(() => makeBuilding({ code: '' })).toThrow('Building code is required')
    })

    it('should reject empty city', () => {
      expect(() => makeBuilding({ city: '' })).toThrow('City is required')
    })

    it('should require country in type', () => {
      expect(() =>
        Building.create({
          name: 'Test',
          code: 'BLD001',
          address: Address.create({
            street: 'Av. Corrientes',
            number: '1234',
            city: 'Buenos Aires',
            country: undefined as unknown as Country,
          }),
          city: 'Buenos Aires',
          country: undefined as unknown as Country,
        })
      ).toThrow('Country is required')
    })
  })

  describe('update', () => {
    it('should update name', () => {
      const building = makeBuilding()
      const updated = building.update({ name: 'New Name' })
      expect(updated.name).toBe('New Name')
    })

    it('should preserve unchanged fields', () => {
      const building = makeBuilding()
      const updated = building.update({ name: 'New Name' })
      expect(updated.code).toBe('BLD001')
      expect(updated.city).toBe('Buenos Aires')
    })

    it('should update updatedAt', () => {
      const building = makeBuilding()
      const updated = building.update({ name: 'New Name' })
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(building.createdAt.getTime())
    })
  })

  describe('equals', () => {
    it('should return false for different id', () => {
      const building1 = makeBuilding()
      const building2 = makeBuilding()
      expect(building1.equals(building2)).toBe(false)
    })

    it('should return false for non-Building', () => {
      const building = makeBuilding()
      expect(building.equals({} as Building)).toBe(false)
    })
  })

  describe('toPlain', () => {
    it('should return plain object', () => {
      const building = makeBuilding()
      const plain = building.toPlain()
      expect(plain.id).toBeDefined()
      expect(plain.name).toBe('Test Building')
      expect(plain.code).toBe('BLD001')
      expect(plain.city).toBe('Buenos Aires')
      expect(plain.country).toBe(Country.ARGENTINA)
    })
  })
})
