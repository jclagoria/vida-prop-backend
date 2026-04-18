import { of, throwError } from 'rxjs'
import { CreateApartmentUseCase } from '@/modules/building-management/application/use-cases/apartment/create-apartment.usecase'
import { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import { Body } from '@/modules/building-management/domain/entities/body.entity'
import { Floor } from '@/modules/building-management/domain/entities/floor.entity'
import { ApartmentStatus } from '@/modules/building-management/domain/enums/apartment-status.enum'
import { Country } from '@/modules/building-management/domain/enums/country.enum'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { UniqueIdentifier } from '@/modules/building-management/domain/value-objects/unique-identifier.value-object'

describe('CreateApartmentUseCase', () => {
  let useCase: CreateApartmentUseCase
  let mockFloorService: { findById: jest.Mock }
  let mockApartmentService: { create: jest.Mock }

  const makeFloor = () => {
    return Floor.create(new BodyId('body-uuid'), 3)
  }

  const makeApartment = (floor: Floor) => {
    return Apartment.create(floor.id, '01', UniqueIdentifier.create('BLD001', 3, '01'), 2, 50)
  }

  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  }

  beforeEach(() => {
    mockFloorService = {
      findById: jest.fn(),
    }

    mockApartmentService = {
      create: jest.fn(),
    }

    useCase = new CreateApartmentUseCase(
      mockLogger as never,
      mockFloorService as never,
      mockApartmentService as never
    )
  })

  describe('execute', () => {
    const floorId = 'floor-uuid'
    const floor = makeFloor()

    const dto = {
      unitNumber: '01',
      totalRooms: 2,
      totalArea: 50,
      status: ApartmentStatus.AVAILABLE,
    }

    it('should create apartment with valid input', (done) => {
      const apartment = makeApartment(floor)
      mockFloorService.findById.mockReturnValue(of(floor))
      mockApartmentService.create.mockReturnValue(of(apartment))

      useCase.execute(floorId, dto).subscribe((result) => {
        expect(result).toBe(apartment)
        done()
      })
    })

    it('should throw error when floor not found', (done) => {
      mockFloorService.findById.mockReturnValue(of(null))

      useCase.execute(floorId, dto).subscribe({
        error: (error) => {
          expect(error.message).toBe('Floor not found')
          done()
        },
      })
    })

    it('should throw error when service fails', (done) => {
      mockFloorService.findById.mockReturnValue(of(floor))
      mockApartmentService.create.mockReturnValue(throwError(() => new Error('DB error')))

      useCase.execute(floorId, dto).subscribe({
        error: (error) => {
          expect(error.message).toBe('DB error')
          done()
        },
      })
    })
  })
})
