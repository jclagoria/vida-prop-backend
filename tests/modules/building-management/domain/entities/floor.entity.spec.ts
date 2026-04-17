import { Floor } from '@/modules/building-management/domain/entities/floor.entity'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'

describe('Floor Entity', () => {
  const makeBodyId = () => new BodyId('body-uuid')

  const makeFloor = (props?: Partial<{ bodyId: BodyId; floorNumber: number }>) => {
    return Floor.create(props?.bodyId ?? makeBodyId(), props?.floorNumber ?? 1)
  }

  describe('create', () => {
    it('should create floor with all required fields', () => {
      const floor = makeFloor({ floorNumber: 1 })
      expect(floor.floorNumber).toBe(1)
    })

    it('should generate UUID for id', () => {
      const floor = makeFloor()
      expect(floor.id.toString()).toBeDefined()
    })

    it('should reject missing body id', () => {
      expect(() => Floor.create(undefined as unknown as BodyId, 1)).toThrow('BodyId is required')
    })

    it('should reject negative floor number', () => {
      expect(() => makeFloor({ floorNumber: -1 })).toThrow(
        'Floor number must be a non-negative number'
      )
    })

    it('should allow floor number zero', () => {
      const floor = makeFloor({ floorNumber: 0 })
      expect(floor.floorNumber).toBe(0)
    })
  })

  describe('update', () => {
    it('should update floor number', () => {
      const floor = makeFloor()
      const updated = floor.update(2)
      expect(updated.floorNumber).toBe(2)
    })

    it('should reject negative floor number', () => {
      const floor = makeFloor()
      expect(() => floor.update(-1)).toThrow('Floor number must be a non-negative number')
    })
  })

  describe('equals', () => {
    it('should return false for different id', () => {
      const floor1 = makeFloor()
      const floor2 = makeFloor()
      expect(floor1.equals(floor2)).toBe(false)
    })
  })

  describe('toPlain', () => {
    it('should return plain object', () => {
      const floor = makeFloor({ floorNumber: 3 })
      const plain = floor.toPlain()
      expect(plain.id).toBeDefined()
      expect(plain.bodyId).toBeDefined()
      expect(plain.floorNumber).toBe(3)
    })
  })
})
