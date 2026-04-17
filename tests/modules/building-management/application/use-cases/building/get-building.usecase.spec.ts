import { of, throwError } from 'rxjs'
import { GetBuildingUseCase } from '@/modules/building-management/application/use-cases/building/get-building.usecase'
import { Building } from '@/modules/building-management/domain/entities/building.entity'
import { Country } from '@/modules/building-management/domain/enums/country.enum'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'

describe('GetBuildingUseCase', () => {
  let useCase: GetBuildingUseCase
  let mockBuildingService: { findById: jest.Mock }

  const makeBuilding = () => {
    return Building.create({
      name: 'Test Building',
      address: Address.create({
        street: 'Test Street',
        number: '123',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
      }),
      code: 'BLD001',
      city: 'Buenos Aires',
      country: Country.ARGENTINA,
    })
  }

  beforeEach(() => {
    mockBuildingService = {
      findById: jest.fn(),
    }

    useCase = new GetBuildingUseCase(mockBuildingService as never)
  })

  describe('execute', () => {
    const buildingId = 'test-uuid'
    const existingBuilding = makeBuilding()

    it('should return building when found', (done) => {
      mockBuildingService.findById.mockReturnValue(of(existingBuilding))

      useCase.execute(buildingId).subscribe((result) => {
        expect(result).toBe(existingBuilding)
        done()
      })
    })

    it('should throw error when building not found', (done) => {
      mockBuildingService.findById.mockReturnValue(of(null))

      useCase.execute(buildingId).subscribe({
        error: (error) => {
          expect(error.message).toBe('Building not found')
          done()
        },
      })
    })
  })
})
