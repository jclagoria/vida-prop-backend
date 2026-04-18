import { take } from 'rxjs/operators'
import { Floor } from '@/modules/building-management/domain/entities/floor.entity'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { PrismaFloorRepository } from '@/modules/building-management/infrastructure/repositories/prisma-floor.repository'

describe('PrismaFloorRepository', () => {
  let repository: PrismaFloorRepository
  let mockPrisma: any

  const prismaFloor = {
    id: 'floor-id',
    bodyId: 'body-id',
    floorNumber: 3,
  }

  beforeEach(() => {
    mockPrisma = {
      $transaction: jest.fn((callback) => callback(mockPrisma)),
      floor: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    }

    repository = new PrismaFloorRepository(mockPrisma)
  })

  describe('findById', () => {
    it('should call findUnique with correct id', (done) => {
      mockPrisma.floor.findUnique.mockResolvedValue(prismaFloor)

      repository
        .findById(new FloorId('floor-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.floor.findUnique).toHaveBeenCalledWith({
              where: { id: 'floor-id' },
            })
            done()
          },
          error: done.fail,
        })
    })

    it('should return null when not found', (done) => {
      mockPrisma.floor.findUnique.mockResolvedValue(null)

      repository
        .findById(new FloorId('non-existent'))
        .pipe(take(1))
        .subscribe({
          next: (result) => {
            expect(result).toBeNull()
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('findByBodyId', () => {
    it('should call findMany with bodyId', (done) => {
      mockPrisma.floor.findMany.mockResolvedValue([prismaFloor])

      repository
        .findByBodyId(new BodyId('body-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.floor.findMany).toHaveBeenCalledWith({
              where: { bodyId: 'body-id' },
            })
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('save', () => {
    it('should call create', (done) => {
      mockPrisma.floor.create.mockResolvedValue(prismaFloor)

      const floor = new Floor({
        id: new FloorId('floor-id'),
        bodyId: new BodyId('body-id'),
        floorNumber: 3,
      })

      repository
        .save(floor)
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.floor.create).toHaveBeenCalled()
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('delete', () => {
    it('should call delete', (done) => {
      mockPrisma.floor.delete.mockResolvedValue({})

      repository
        .delete(new FloorId('floor-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.floor.delete).toHaveBeenCalledWith({
              where: { id: 'floor-id' },
            })
            done()
          },
          error: done.fail,
        })
    })
  })
})
