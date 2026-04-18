import { BadRequestException } from '@nestjs/common'
import { of, throwError } from 'rxjs'
import type { BulkCreateApartmentsUseCase } from '@/modules/building-management/application/use-cases/apartment/bulk-create-apartments.usecase'
import type { CreateApartmentUseCase } from '@/modules/building-management/application/use-cases/apartment/create-apartment.usecase'
import type { GetApartmentByIdentifierUseCase } from '@/modules/building-management/application/use-cases/apartment/get-apartment-by-identifier.usecase'
import { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import { ApartmentStatus } from '@/modules/building-management/domain/enums/apartment-status.enum'
import { ApartmentId } from '@/modules/building-management/domain/value-objects/apartment-id.value-object'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { UniqueIdentifier } from '@/modules/building-management/domain/value-objects/unique-identifier.value-object'
import { CsvParserService } from '@/modules/building-management/infrastructure/services/csv-parser.service'
import { ApartmentController } from '@/modules/building-management/presentation/controllers/apartment.controller'

const mockCreateUseCase = { execute: jest.fn() }
const mockGetByIdentifierUseCase = { execute: jest.fn() }
const mockBulkCreateUseCase = { execute: jest.fn() }

const mockApartment = {
  id: new ApartmentId('apartment-id'),
  floorId: new FloorId('floor-id'),
  unitNumber: '01',
  uniqueIdentifier: UniqueIdentifier.create('BLD001', 1, '01'),
  totalRooms: 2,
  totalArea: 50,
  status: ApartmentStatus.AVAILABLE,
}

const makeApartment = () => new Apartment(mockApartment)

describe('ApartmentController', () => {
  let controller: ApartmentController

  beforeEach(() => {
    jest.clearAllMocks()

    controller = new ApartmentController(
      mockCreateUseCase as unknown as CreateApartmentUseCase,
      mockGetByIdentifierUseCase as unknown as GetApartmentByIdentifierUseCase,
      mockBulkCreateUseCase as unknown as BulkCreateApartmentsUseCase,
      new CsvParserService()
    )
  })

  describe('create', () => {
    it('should create apartment', async () => {
      const dto = {
        floorId: 'floor-id',
        unitNumber: '01',
        buildgCode: 'BLD001',
        floorNumber: 1,
        totalRooms: 2,
        totalArea: 50,
      }
      mockCreateUseCase.execute.mockReturnValue(of(makeApartment()))

      const result = await controller.create(dto)

      expect(result).toEqual(
        expect.objectContaining({
          id: 'apartment-id',
        })
      )
    })
  })

  describe('findByIdentifier', () => {
    it('should return apartment by unique identifier', async () => {
      mockGetByIdentifierUseCase.execute.mockReturnValue(of(makeApartment()))

      const result = await controller.findByIdentifier('BLD001-001-01')

      expect(result).toEqual(
        expect.objectContaining({
          id: 'apartment-id',
        })
      )
    })
  })

  describe('bulkImport', () => {
    it('should bulk import apartments from CSV', async () => {
      const body = { csv: 'floorId,unitNumber,totalRooms,totalArea\nfloor1,01,2,50' }
      mockBulkCreateUseCase.execute.mockReturnValue(of([makeApartment()]))

      const result = await controller.bulkImport(body)

      expect(result.count).toBe(1)
    })

    it('should throw BadRequestException with APARTMENT_CSV_ERROR code on error', async () => {
      const body = { csv: 'invalid' }

      await expect(controller.bulkImport(body)).rejects.toThrow(BadRequestException)
      try {
        await controller.bulkImport(body)
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect((error as BadRequestException).getResponse()).toEqual(
          expect.objectContaining({
            message: 'CSV must have at least a header and one data row',
            code: 'APARTMENT_CSV_ERROR',
          })
        )
      }
    })
  })
})
