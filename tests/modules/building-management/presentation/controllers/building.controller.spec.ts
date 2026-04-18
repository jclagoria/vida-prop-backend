import { BadRequestException, NotFoundException } from '@nestjs/common'
import { of, throwError } from 'rxjs'
import type { BuildingFilterDto } from '@/modules/building-management/application/dto/building-filter.dto'
import type { CreateBuildingDto } from '@/modules/building-management/application/dto/create-building.dto'
import type { CreateBuildingUseCase } from '@/modules/building-management/application/use-cases/building/create-building.usecase'
import type { DeleteBuildingUseCase } from '@/modules/building-management/application/use-cases/building/delete-building.usecase'
import type { GetBuildingUseCase } from '@/modules/building-management/application/use-cases/building/get-building.usecase'
import type { UpdateBuildingUseCase } from '@/modules/building-management/application/use-cases/building/update-building.usecase'
import type { FilterBuildingsUseCase } from '@/modules/building-management/application/use-cases/common/filter-buildings.usecase'
import type { GetBuildingStructureUseCase } from '@/modules/building-management/application/use-cases/common/get-building-structure.usecase'
import { Building } from '@/modules/building-management/domain/entities/building.entity'
import { Country } from '@/modules/building-management/domain/enums/country.enum'
import { Address } from '@/modules/building-management/domain/value-objects/address.value-object'
import { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'
import { BuildingController } from '@/modules/building-management/presentation/controllers/building.controller'

const mockCreateUseCase = { execute: jest.fn() }
const mockUpdateUseCase = { execute: jest.fn() }
const mockDeleteUseCase = { execute: jest.fn() }
const mockGetBuildingUseCase = { execute: jest.fn() }
const mockFilterBuildingsUseCase = { execute: jest.fn() }
const mockGetBuildingStructureUseCase = { execute: jest.fn() }

const mockBuilding = {
  id: new BuildingId('building-id'),
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
  notes: 'Test notes',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const makeBuilding = () => new Building(mockBuilding)

describe('BuildingController', () => {
  let controller: BuildingController

  beforeEach(() => {
    jest.clearAllMocks()

    controller = new BuildingController(
      mockCreateUseCase as unknown as CreateBuildingUseCase,
      mockUpdateUseCase as unknown as UpdateBuildingUseCase,
      mockDeleteUseCase as unknown as DeleteBuildingUseCase,
      mockGetBuildingUseCase as unknown as GetBuildingUseCase,
      mockFilterBuildingsUseCase as unknown as FilterBuildingsUseCase,
      mockGetBuildingStructureUseCase as unknown as GetBuildingStructureUseCase
    )
  })

  describe('create', () => {
    it('should create building and return response', async () => {
      const dto: CreateBuildingDto = {
        name: 'Test Building',
        address: 'Test Street 123',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
        code: 'BLD001',
      }
      mockCreateUseCase.execute.mockReturnValue(of(makeBuilding()))

      const result = await controller.create(dto)

      expect(result).toEqual(
        expect.objectContaining({
          id: 'building-id',
          name: 'Test Building',
        })
      )
      expect(mockCreateUseCase.execute).toHaveBeenCalledWith(dto)
    })

    it('should throw BadRequestException with BUILDING_VALIDATION_ERROR code on error', async () => {
      const dto: CreateBuildingDto = {
        name: 'Test Building',
        address: 'Test Street 123',
        city: 'Buenos Aires',
        country: Country.ARGENTINA,
        code: 'BLD001',
      }
      mockCreateUseCase.execute.mockReturnValue(throwError(() => new Error('validation failed')))

      await expect(controller.create(dto)).rejects.toThrow(BadRequestException)
      try {
        await controller.create(dto)
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect((error as BadRequestException).getResponse()).toEqual(
          expect.objectContaining({
            message: 'validation failed',
            code: 'BUILDING_VALIDATION_ERROR',
          })
        )
      }
    })
  })

  describe('findAll', () => {
    it('should return paginated buildings', async () => {
      const filter: BuildingFilterDto = { page: 1, limit: 20 }
      mockFilterBuildingsUseCase.execute.mockReturnValue(
        of({ data: [makeBuilding()], total: 1, page: 1, limit: 20, totalPages: 1 })
      )

      const result = await controller.findAll(filter)

      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
    })
  })

  describe('findOne', () => {
    it('should return building by id', async () => {
      mockGetBuildingUseCase.execute.mockReturnValue(of(makeBuilding()))

      const result = await controller.findOne('building-id')

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Test Building',
        })
      )
    })

    it('should throw NotFoundException with BUILDING_NOT_FOUND code when not found', async () => {
      mockGetBuildingUseCase.execute.mockReturnValue(
        throwError(() => new Error('Building not found'))
      )

      await expect(controller.findOne('non-existent')).rejects.toThrow(NotFoundException)
      try {
        await controller.findOne('non-existent')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
        expect((error as NotFoundException).getResponse()).toEqual(
          expect.objectContaining({
            message: 'Building not found',
            code: 'BUILDING_NOT_FOUND',
          })
        )
      }
    })
  })

  describe('update', () => {
    it('should update building', async () => {
      const updateDto = { name: 'Updated Building' }
      mockUpdateUseCase.execute.mockReturnValue(of(makeBuilding()))

      await controller.update('building-id', updateDto)

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith('building-id', updateDto)
    })
  })

  describe('remove', () => {
    it('should delete building', async () => {
      mockDeleteUseCase.execute.mockReturnValue(of(undefined))

      await controller.remove('building-id')

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith('building-id')
    })
  })

  describe('getStructure', () => {
    it('should return building structure', async () => {
      const structure = {
        id: 'building-id',
        name: 'Test Building',
        code: 'BLD001',
        bodies: [],
      }
      mockGetBuildingStructureUseCase.execute.mockReturnValue(of(structure))

      const result = await controller.getStructure('building-id')

      expect(result.id).toBe('building-id')
    })

    it('should throw NotFoundException with BUILDING_NOT_FOUND code when not found', async () => {
      mockGetBuildingStructureUseCase.execute.mockReturnValue(
        throwError(() => new Error('Building not found'))
      )

      await expect(controller.getStructure('non-existent')).rejects.toThrow(NotFoundException)
      try {
        await controller.getStructure('non-existent')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
        expect((error as NotFoundException).getResponse()).toEqual(
          expect.objectContaining({
            message: 'Building not found',
            code: 'BUILDING_NOT_FOUND',
          })
        )
      }
    })
  })
})
