import { Body } from '@/modules/building-management/domain/entities/body.entity'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'

describe('Body Entity', () => {
  const makeBuildingId = () => new BuildingId('building-uuid')
  const _makeBodyId = () => new BodyId('body-uuid')

  const makeBody = (props?: Partial<{ buildingId: BuildingId; name: string }>) => {
    return Body.create(props?.buildingId ?? makeBuildingId(), props?.name ?? 'A')
  }

  describe('create', () => {
    it('should create body with all required fields', () => {
      const body = makeBody({ name: 'A' })
      expect(body.name).toBe('A')
    })

    it('should generate UUID for id', () => {
      const body = makeBody()
      expect(body.id.toString()).toBeDefined()
    })

    it('should uppercase name', () => {
      const body = makeBody({ name: 'a' })
      expect(body.name).toBe('A')
    })

    it('should reject empty name', () => {
      expect(() => Body.create(makeBuildingId(), '')).toThrow('Body name is required')
    })

    it('should reject missing building id', () => {
      expect(() => Body.create(undefined as unknown as BuildingId, 'A')).toThrow(
        'BuildingId is required'
      )
    })
  })

  describe('update', () => {
    it('should update name', () => {
      const body = makeBody()
      const updated = body.update('B')
      expect(updated.name).toBe('B')
    })

    it('should uppercase updated name', () => {
      const body = makeBody()
      const updated = body.update('b')
      expect(updated.name).toBe('B')
    })
  })

  describe('equals', () => {
    it('should return false for different id', () => {
      const body1 = makeBody()
      const body2 = makeBody()
      expect(body1.equals(body2)).toBe(false)
    })
  })

  describe('toPlain', () => {
    it('should return plain object', () => {
      const body = makeBody()
      const plain = body.toPlain()
      expect(plain.id).toBeDefined()
      expect(plain.buildingId).toBeDefined()
      expect(plain.name).toBe('A')
    })
  })
})
