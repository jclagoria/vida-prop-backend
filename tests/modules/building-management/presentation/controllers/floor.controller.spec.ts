import { of, throwError } from 'rxjs'
import type { CreateFloorDto } from '@/modules/building-management/application/dto/create-floor.dto'
import type { CreateFloorUseCase } from '@/modules/building-management/application/use-cases/floor/create-floor.usecase'
import { Floor } from '@/modules/building-management/domain/entities/floor.entity'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { FloorId } from '@/modules/building-management/domain/value-objects/floor-id.value-object'
import { FloorController } from '@/modules/building-management/presentation/controllers/floor.controller'

const mockCreateUseCase = { execute: jest.fn() }

const mockFloor = {
  id: new FloorId('floor-id'),
  bodyId: new BodyId('body-id'),
  floorNumber: 3,
}

const makeFloor = () => new Floor(mockFloor)

describe('FloorController', () => {
  let controller: FloorController

  beforeEach(() => {
    jest.clearAllMocks()

    controller = new FloorController(mockCreateUseCase as unknown as CreateFloorUseCase)
  })

  describe('create', () => {
    it('should create floor under body', async () => {
      const dto: CreateFloorDto = { floorNumber: 3 }
      mockCreateUseCase.execute.mockReturnValue(of(makeFloor()))

      const result = await controller.create('body-id', dto)

      expect(result).toEqual(
        expect.objectContaining({
          id: 'floor-id',
          floorNumber: 3,
        })
      )
      expect(mockCreateUseCase.execute).toHaveBeenCalledWith('body-id', dto)
    })

    it('should throw BadRequestException on error', async () => {
      const dto: CreateFloorDto = { floorNumber: 3 }
      mockCreateUseCase.execute.mockReturnValue(throwError(() => new Error('validation failed')))

      await expect(controller.create('body-id', dto)).rejects.toThrow('validation failed')
    })
  })
})
