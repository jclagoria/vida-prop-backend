import { of, throwError } from 'rxjs'
import { BulkCreateApartmentsUseCase } from '@/modules/building-management/application/use-cases/apartment/bulk-create-apartments.usecase'
import { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import { Body } from '@/modules/building-management/domain/entities/body.entity'
import { Floor } from '@/modules/building-management/domain/entities/floor.entity'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { UniqueIdentifier } from '@/modules/building-management/domain/value-objects/unique-identifier.value-object'

describe('BulkCreateApartmentsUseCase', () => {
  let useCase: BulkCreateApartmentsUseCase
  let mockApartmentService: { bulkCreate: jest.Mock }

  const makeFloor = () => Floor.create(new BodyId('body-uuid'), 1)

  const makeApartment = (floor: Floor, unitNumber: string) => {
    return Apartment.create(
      floor.id,
      unitNumber,
      UniqueIdentifier.create('BLD001', 1, unitNumber),
      2,
      50
    )
  }

  beforeEach(() => {
    mockApartmentService = {
      bulkCreate: jest.fn(),
    }

    useCase = new BulkCreateApartmentsUseCase(mockApartmentService as never)
  })

  describe('execute', () => {
    const floor = makeFloor()
    const apartmentsData = [
      { unitNumber: '01', totalRooms: 2, totalArea: 50, floorId: floor.id.toString() },
      { unitNumber: '02', totalRooms: 2, totalArea: 50, floorId: floor.id.toString() },
    ]

    it('should create multiple apartments', (done) => {
      const created = [makeApartment(floor, '01'), makeApartment(floor, '02')]
      mockApartmentService.bulkCreate.mockReturnValue(of(created))

      useCase.execute(apartmentsData).subscribe((result) => {
        expect(result).toHaveLength(2)
        done()
      })
    })

    it('should throw error when no apartments provided', (done) => {
      useCase.execute([]).subscribe({
        error: (error) => {
          expect(error.message).toBe('No apartments provided')
          done()
        },
      })
    })

    it('should throw error when service fails', (done) => {
      mockApartmentService.bulkCreate.mockReturnValue(throwError(() => new Error('DB error')))

      useCase.execute(apartmentsData).subscribe({
        error: (error) => {
          expect(error.message).toBe('DB error')
          done()
        },
      })
    })
  })
})
