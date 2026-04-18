import { take } from 'rxjs/operators'
import { Body } from '@/modules/building-management/domain/entities/body.entity'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'
import { PrismaBodyRepository } from '@/modules/building-management/infrastructure/repositories/prisma-body.repository'

describe('PrismaBodyRepository', () => {
  let repository: PrismaBodyRepository
  let mockPrisma: any

  const prismaBody = {
    id: 'body-id',
    buildingId: 'building-id',
    name: 'A',
  }

  beforeEach(() => {
    mockPrisma = {
      $transaction: jest.fn((callback) => callback(mockPrisma)),
      body: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    }

    repository = new PrismaBodyRepository(mockPrisma)
  })

  describe('findById', () => {
    it('should call findUnique with correct id', (done) => {
      mockPrisma.body.findUnique.mockResolvedValue(prismaBody)

      repository
        .findById(new BodyId('body-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.body.findUnique).toHaveBeenCalledWith({
              where: { id: 'body-id' },
            })
            done()
          },
          error: done.fail,
        })
    })

    it('should return null when not found', (done) => {
      mockPrisma.body.findUnique.mockResolvedValue(null)

      repository
        .findById(new BodyId('non-existent'))
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

  describe('findByBuildingId', () => {
    it('should call findMany with buildingId', (done) => {
      mockPrisma.body.findMany.mockResolvedValue([prismaBody])

      repository
        .findByBuildingId(new BuildingId('building-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.body.findMany).toHaveBeenCalledWith({
              where: { buildingId: 'building-id' },
            })
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('save', () => {
    it('should call create', (done) => {
      mockPrisma.body.create.mockResolvedValue(prismaBody)

      const body = new Body({
        id: new BodyId('body-id'),
        buildingId: new BuildingId('building-id'),
        name: 'A',
      })

      repository
        .save(body)
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.body.create).toHaveBeenCalled()
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('delete', () => {
    it('should call delete', (done) => {
      mockPrisma.body.delete.mockResolvedValue({})

      repository
        .delete(new BodyId('body-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.body.delete).toHaveBeenCalledWith({
              where: { id: 'body-id' },
            })
            done()
          },
          error: done.fail,
        })
    })
  })
})
