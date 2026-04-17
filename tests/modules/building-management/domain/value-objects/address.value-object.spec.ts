import { Country } from '@/modules/building-management/domain/enums/country.enum'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'

describe('Address Value Object', () => {
  describe('create', () => {
    it('should create address with all fields', () => {
      const address = Address.create({
        street: 'Av. Corrientes',
        number: '1234',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
        postalCode: 'C1043',
      })
      expect(address.street).toBe('Av. Corrientes')
      expect(address.number).toBe('1234')
      expect(address.city).toBe('Buenos Aires')
      expect(address.country).toBe(Country.ARGENTINA)
      expect(address.postalCode).toBe('C1043')
    })

    it('should create address without optional postal code', () => {
      const address = Address.create({
        street: 'Av. Corrientes',
        number: '1234',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
      })
      expect(address.postalCode).toBeUndefined()
    })

    it('should trim whitespace from fields', () => {
      const address = Address.create({
        street: '  Av. Corrientes  ',
        number: '  1234  ',
        city: '  Buenos Aires  ',
        country: Country.ARGENTINA,
      })
      expect(address.street).toBe('Av. Corrientes')
      expect(address.number).toBe('1234')
      expect(address.city).toBe('Buenos Aires')
    })

    it('should reject empty street', () => {
      expect(() =>
        Address.create({
          street: '',
          number: '1234',
          city: 'Buenos Aires',
          country: Country.ARGENTINA,
        })
      ).toThrow('Street is required')
    })

    it('should reject empty number', () => {
      expect(() =>
        Address.create({
          street: 'Av. Corrientes',
          number: '',
          city: 'Buenos Aires',
          country: Country.ARGENTINA,
        })
      ).toThrow('Street number is required')
    })

    it('should reject empty city', () => {
      expect(() =>
        Address.create({
          street: 'Av. Corrientes',
          number: '1234',
          city: '',
          country: Country.ARGENTINA,
        })
      ).toThrow('City is required')
    })

    it('should reject missing country', () => {
      expect(() =>
        Address.create({
          street: 'Av. Corrientes',
          number: '1234',
          city: 'Buenos Aires',
          country: undefined as unknown as Country,
        })
      ).toThrow('Country is required')
    })
  })

  describe('equals', () => {
    it('should return true for same address', () => {
      const addr1 = Address.create({
        street: 'Av. Corrientes',
        number: '1234',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
      })
      const addr2 = Address.create({
        street: 'Av. Corrientes',
        number: '1234',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
      })
      expect(addr1.equals(addr2)).toBe(true)
    })

    it('should return false for different street', () => {
      const addr1 = Address.create({
        street: 'Av. Corrientes',
        number: '1234',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
      })
      const addr2 = Address.create({
        street: 'Av. Santa Fe',
        number: '1234',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
      })
      expect(addr1.equals(addr2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return formatted address', () => {
      const address = Address.create({
        street: 'Av. Corrientes',
        number: '1234',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
      })
      expect(address.toString()).toBe('Av. Corrientes, 1234, Buenos Aires, ARGENTINA')
    })

    it('should include postal code when present', () => {
      const address = Address.create({
        street: 'Av. Corrientes',
        number: '1234',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
        postalCode: 'C1043',
      })
      expect(address.toString()).toBe('Av. Corrientes, 1234, Buenos Aires, C1043, ARGENTINA')
    })
  })
})
