import { UniqueIdentifier } from '@/modules/building-management/domain/value-objects/unique-identifier.value-object'

describe('UniqueIdentifier Value Object', () => {
  describe('create', () => {
    it('should create identifier with body', () => {
      const id = UniqueIdentifier.create('BLD001', 3, '01', 'A')
      expect(id.value).toBe('BLD001-A-00301')
    })

    it('should create identifier without body', () => {
      const id = UniqueIdentifier.create('BLD001', 3, '01')
      expect(id.value).toBe('BLD001---00301')
    })

    it('should create identifier with single digit floor', () => {
      const id = UniqueIdentifier.create('BLD001', 1, '01', 'A')
      expect(id.value).toBe('BLD001-A-00101')
    })

    it('should create identifier with multi-digit floor', () => {
      const id = UniqueIdentifier.create('BLD001', 12, '05', 'B')
      expect(id.value).toBe('BLD001-B-01205')
    })

    it('should reject empty building code', () => {
      expect(() => UniqueIdentifier.create('', 1, '01')).toThrow('Building code is required')
    })

    it('should reject negative floor number', () => {
      expect(() => UniqueIdentifier.create('BLD001', -1, '01')).toThrow(
        'Floor number must be a positive number'
      )
    })

    it('should reject empty unit number', () => {
      expect(() => UniqueIdentifier.create('BLD001', 1, '')).toThrow('Unit number is required')
    })
  })

  describe('equals', () => {
    it('should return true for same value', () => {
      const id1 = UniqueIdentifier.create('BLD001', 1, '01', 'A')
      const id2 = UniqueIdentifier.create('BLD001', 1, '01', 'A')
      expect(id1.equals(id2)).toBe(true)
    })

    it('should return false for different value', () => {
      const id1 = UniqueIdentifier.create('BLD001', 1, '01', 'A')
      const id2 = UniqueIdentifier.create('BLD002', 1, '01', 'A')
      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the value', () => {
      const id = UniqueIdentifier.create('BLD001', 3, '01', 'A')
      expect(id.toString()).toBe('BLD001-A-00301')
    })
  })

  describe('properties', () => {
    it('should expose building code', () => {
      const id = UniqueIdentifier.create('BLD001', 1, '01', 'A')
      expect(id.buildingCode).toBe('BLD001')
    })

    it('should expose body name when provided', () => {
      const id = UniqueIdentifier.create('BLD001', 1, '01', 'A')
      expect(id.bodyName).toBe('A')
    })

    it('should expose undefined for body name when not provided', () => {
      const id = UniqueIdentifier.create('BLD001', 1, '01')
      expect(id.bodyName).toBeUndefined()
    })

    it('should expose floor number', () => {
      const id = UniqueIdentifier.create('BLD001', 5, '01')
      expect(id.floorNumber).toBe(5)
    })

    it('should expose unit number', () => {
      const id = UniqueIdentifier.create('BLD001', 1, '02')
      expect(id.unitNumber).toBe('02')
    })
  })
})
