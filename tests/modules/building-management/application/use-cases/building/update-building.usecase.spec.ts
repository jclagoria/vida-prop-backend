import { of, throwError } from 'rxjs'
import { UpdateBuildingUseCase } from '@/modules/building-management/application/use-cases/building/update-building.usecase'
import { Building } from '@/modules/building-management/domain/entities/building.entity'
import { Country } from '@/modules/building-management/domain/enums/country.enum'
import { BuildingDomainService } from '@/modules/building-management/domain/services/building.domain-service'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'

describe('UpdateBuildingUseCase', () => {
  let useCase: UpdateBuildingUseCase
  let mockBuildingService: { findById: jest.Mock; update: jest.Mock }
  let mockDomainService: { validateBuilding: jest.Mock }

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
      update: jest.fn(),
    }

    mockDomainService = {
      validateBuilding: jest.fn(),
    }

    useCase = new UpdateBuildingUseCase(mockBuildingService as never, mockDomainService as never)
  })

  describe('execute', () => {
    const buildingId = 'test-uuid'
    const existingBuilding = makeBuilding()

    it('should update building with valid input', (done) => {
      const updatedBuilding = existingBuilding.update({ name: 'Updated Building' })
      mockBuildingService.findById.mockReturnValue(of(existingBuilding))
      mockBuildingService.update.mockReturnValue(of(updatedBuilding))
      mockDomainService.validateBuilding.mockReturnValue({ valid: true, errors: [] })

      const dto = { name: 'Updated Building' }

      useCase.execute(buildingId, dto).subscribe((result) => {
        expect(result.name).toBe('Updated Building')
        done()
      })
    })

    it('should throw error when building not found', (done) => {
      mockBuildingService.findById.mockReturnValue(of(null))

      useCase.execute(buildingId, { name: 'New Name' }).subscribe({
        error: (error) => {
          expect(error.message).toBe('Building not found')
          done()
        },
      })
    })

    it('should throw error when validation fails', (done) => {
      mockBuildingService.findById.mockReturnValue(of(existingBuilding))
      mockDomainService.validateBuilding.mockReturnValue({
        valid: false,
        errors: ['Building code is required'],
      })

      useCase.execute(buildingId, { code: '' }).subscribe({
        error: (error) => {
          expect(error.message).toContain('Building code is required')
          done()
        },
      })
    })
  })
})
