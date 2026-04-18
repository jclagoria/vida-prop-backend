import { UniqueIdentifierService } from '@/modules/building-management/infrastructure/services/unique-identifier.service'

describe('UniqueIdentifierService', () => {
  let service: UniqueIdentifierService

  beforeEach(() => {
    service = new UniqueIdentifierService()
  })

  describe('generate', () => {
    it('should generate identifier with body', () => {
      const result = service.generate('BLD001', 'A', 3, '01')
      expect(result).toBe('BLD001-A-00301')
    })

    it('should generate identifier without body', () => {
      const result = service.generate('BLD001', null, 3, '01')
      expect(result).toBe('BLD001--00301')
    })
  })

  describe('parse', () => {
    it('should parse identifier correctly', () => {
      const result = service.parse('BLD001-A-00301')
      expect(result.buildingCode).toBe('BLD001')
      expect(result.bodyName).toBe('A')
      expect(result.floorNumber).toBe(3)
      expect(result.unitNumber).toBe('01')
    })

    it('should parse identifier without body', () => {
      const result = service.parse('BLD001--00301')
      expect(result.buildingCode).toBe('BLD001')
      expect(result.bodyName).toBeNull()
      expect(result.floorNumber).toBe(3)
      expect(result.unitNumber).toBe('01')
    })
  })

  describe('validate', () => {
    it('should validate correct identifier format', () => {
      expect(service.validate('BLD001-A-00301')).toBe(true)
    })

    it('should reject invalid identifier', () => {
      expect(service.validate('invalid')).toBe(false)
    })
  })

  describe('extractBuildingCode', () => {
    it('should extract building code', () => {
      const result = service.extractBuildingCode('BLD001-A-00301')
      expect(result).toBe('BLD001')
    })
  })
})
