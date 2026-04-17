import { take } from 'rxjs/operators'
import { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import { ApartmentStatus } from '@/modules/building-management/domain/enums/apartment-status.enum'
import { ApartmentId } from '@/modules/building-management/domain/value-objects/apartment-id.value-object'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { UniqueIdentifier } from '@/modules/building-management/domain/value-objects/unique-identifier.value-object'
import { PrismaApartmentRepository } from '@/modules/building-management/infrastructure/repositories/prisma-apartment.repository'

describe('PrismaApartmentRepository', () => {
  let repository: PrismaApartmentRepository
  let mockPrisma: any

  const prismaApartment = {
    id: 'apartment-id',
    floorId: 'floor-id',
    unitNumber: '01',
    uniqueIdentifier: 'BLD001-001-0301',
    totalRooms: 2,
    totalArea: 50,
    status: 'AVAILABLE',
  }

  beforeEach(() => {
    mockPrisma = {
      apartment: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    }

    repository = new PrismaApartmentRepository(mockPrisma)
  })

  describe('findById', () => {
    it('should call findUnique with correct id', (done) => {
      mockPrisma.apartment.findUnique.mockResolvedValue(prismaApartment)

      repository
        .findById(new ApartmentId('apartment-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.apartment.findUnique).toHaveBeenCalledWith({
              where: { id: 'apartment-id' },
            })
            done()
          },
          error: done.fail,
        })
    })

    it('should return null when not found', (done) => {
      mockPrisma.apartment.findUnique.mockResolvedValue(null)

      repository
        .findById(new ApartmentId('non-existent'))
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

  describe('findByUniqueIdentifier', () => {
    it('should call findUnique with uniqueIdentifier', (done) => {
      mockPrisma.apartment.findUnique.mockResolvedValue(prismaApartment)

      repository
        .findByUniqueIdentifier('BLD001-001-0301')
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.apartment.findUnique).toHaveBeenCalledWith({
              where: { uniqueIdentifier: 'BLD001-001-0301' },
            })
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('findByFloorId', () => {
    it('should call findMany with floorId', (done) => {
      mockPrisma.apartment.findMany.mockResolvedValue([prismaApartment])

      repository
        .findByFloorId(new FloorId('floor-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.apartment.findMany).toHaveBeenCalledWith({
              where: { floorId: 'floor-id' },
            })
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('save', () => {
    it('should call create', (done) => {
      mockPrisma.apartment.create.mockResolvedValue(prismaApartment)

      const identifier = UniqueIdentifier.create('BLD001', 1, '01')
      const apartment = new Apartment({
        id: new ApartmentId('apartment-id'),
        floorId: new FloorId('floor-id'),
        unitNumber: '01',
        uniqueIdentifier: identifier,
        totalRooms: 2,
        totalArea: 50,
        status: ApartmentStatus.AVAILABLE,
      })

      repository
        .save(apartment)
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.apartment.create).toHaveBeenCalled()
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('delete', () => {
    it('should call delete', (done) => {
      mockPrisma.apartment.delete.mockResolvedValue({})

      repository
        .delete(new ApartmentId('apartment-id'))
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockPrisma.apartment.delete).toHaveBeenCalledWith({
              where: { id: 'apartment-id' },
            })
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('bulkCreate', () => {
    it('should call $transaction', (done) => {
      const mockTransaction = jest.fn().mockResolvedValue([prismaApartment, prismaApartment])
      mockPrisma.$transaction = mockTransaction

      const apartments = [
        {
          floorId: 'floor-id',
          unitNumber: '01',
          uniqueIdentifier: 'BLD001-001-0301',
          totalRooms: 2,
          totalArea: 50,
          status: 'AVAILABLE',
        },
      ]

      repository
        .bulkCreate(apartments as any)
        .pipe(take(1))
        .subscribe({
          next: () => {
            expect(mockTransaction).toHaveBeenCalled()
            done()
          },
          error: done.fail,
        })
    })
  })
})
