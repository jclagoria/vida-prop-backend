import { of, throwError } from 'rxjs'
import { DeleteBuildingUseCase } from '@/modules/building-management/application/use-cases/building/delete-building.usecase'
import { Building } from '@/modules/building-management/domain/entities/building.entity'
import { Country } from '@/modules/building-management/domain/enums/country.enum'
import { BuildingDomainService } from '@/modules/building-management/domain/services/building.domain-service'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'

describe('DeleteBuildingUseCase', () => {
  let useCase: DeleteBuildingUseCase
  let mockBuildingService: { findById: jest.Mock; delete: jest.Mock }
  let mockDomainService: { canDeleteBuilding: jest.Mock }

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
      delete: jest.fn(),
    }

    mockDomainService = {
      canDeleteBuilding: jest.fn(),
    }

    useCase = new DeleteBuildingUseCase(mockBuildingService as never, mockDomainService as never)
  })

  describe('execute', () => {
    const buildingId = 'test-uuid'
    const existingBuilding = makeBuilding()

    it('should delete building when found and can be deleted', (done) => {
      mockBuildingService.findById.mockReturnValue(of(existingBuilding))
      mockDomainService.canDeleteBuilding.mockReturnValue(true)
      mockBuildingService.delete.mockReturnValue(of(undefined))

      useCase.execute(buildingId).subscribe({
        next: () => {
          expect(mockBuildingService.delete).toHaveBeenCalledWith(buildingId)
          done()
        },
        error: done.fail,
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

    it('should throw error when building cannot be deleted', (done) => {
      mockBuildingService.findById.mockReturnValue(of(existingBuilding))
      mockDomainService.canDeleteBuilding.mockReturnValue(false)

      useCase.execute(buildingId).subscribe({
        error: (error) => {
          expect(error.message).toBe('Building cannot be deleted due to active contracts')
          done()
        },
      })
    })
  })
})
