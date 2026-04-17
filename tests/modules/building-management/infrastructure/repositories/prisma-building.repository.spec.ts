import { take } from 'rxjs/operators'
import { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'
import { PrismaBuildingRepository } from '@/modules/building-management/infrastructure/repositories/prisma-building.repository'

describe('PrismaBuildingRepository', () => {
  let repository: PrismaBuildingRepository
  let mockPrisma: any

  const prismaBuilding = {
    id: 'building-id',
    name: 'Test Building',
    address: 'Test Street 123',
    city: 'Buenos Aires',
    country: 'ARGENTINA',
    code: 'BLD001',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockPrisma = {
      building: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    }

    repository = new PrismaBuildingRepository(mockPrisma)
  })

  describe('findById', () => {
    it('should call findUnique with correct id', (done) => {
      mockPrisma.building.findUnique.mockResolvedValue(prismaBuilding)

      repository
        .findById(new BuildingId('building-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.building.findUnique).toHaveBeenCalledWith({
              where: { id: 'building-id' },
            })
            done()
          },
          error: done.fail,
        })
    })

    it('should return null when not found', (done) => {
      mockPrisma.building.findUnique.mockResolvedValue(null)

      repository
        .findById(new BuildingId('non-existent'))
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

  describe('findAll', () => {
    it('should call findMany without filter', (done) => {
      mockPrisma.building.findMany.mockResolvedValue([prismaBuilding])

      repository
        .findAll()
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.building.findMany).toHaveBeenCalledWith({ where: undefined })
            done()
          },
          error: done.fail,
        })
    })

    it('should apply filter when provided', (done) => {
      mockPrisma.building.findMany.mockResolvedValue([prismaBuilding])

      repository
        .findAll({ country: 'ARGENTINA' as any })
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.building.findMany).toHaveBeenCalledWith({
              where: { country: 'ARGENTINA' },
            })
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('delete', () => {
    it('should call delete', (done) => {
      mockPrisma.building.delete.mockResolvedValue({})

      repository
        .delete(new BuildingId('building-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.building.delete).toHaveBeenCalledWith({
              where: { id: 'building-id' },
            })
            done()
          },
          error: done.fail,
        })
    })
  })
})
