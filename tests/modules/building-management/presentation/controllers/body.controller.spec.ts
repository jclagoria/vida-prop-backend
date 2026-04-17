import { of, throwError } from 'rxjs'
import type { CreateBodyDto } from '@/modules/building-management/application/dto/create-body.dto'
import type { CreateBodyUseCase } from '@/modules/building-management/application/use-cases/body/create-body.usecase'
import type { DeleteBodyUseCase } from '@/modules/building-management/application/use-cases/body/delete-body.usecase'
import { Body } from '@/modules/building-management/domain/entities/body.entity'
import { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'
import { BodyController } from '@/modules/building-management/presentation/controllers/body.controller'

const mockCreateUseCase = { execute: jest.fn() }
const mockDeleteUseCase = { execute: jest.fn() }

const mockBody = {
  id: new BodyId('body-id'),
  buildingId: new BuildingId('building-id'),
  name: 'A',
}

const makeBody = () => new Body(mockBody)

describe('BodyController', () => {
  let controller: BodyController

  beforeEach(() => {
    jest.clearAllMocks()

    controller = new BodyController(
      mockCreateUseCase as unknown as CreateBodyUseCase,
      mockDeleteUseCase as unknown as DeleteBodyUseCase
    )
  })

  describe('create', () => {
    it('should create body under building', async () => {
      const dto: CreateBodyDto = { name: 'A' }
      mockCreateUseCase.execute.mockReturnValue(of(makeBody()))

      const result = await controller.create('building-id', dto)

      expect(result).toEqual(
        expect.objectContaining({
          id: 'body-id',
          name: 'A',
        })
      )
      expect(mockCreateUseCase.execute).toHaveBeenCalledWith('building-id', dto)
    })

    it('should throw BadRequestException on error', async () => {
      const dto: CreateBodyDto = { name: 'A' }
      mockCreateUseCase.execute.mockReturnValue(throwError(() => new Error('validation failed')))

      await expect(controller.create('building-id', dto)).rejects.toThrow('validation failed')
    })
  })

  describe('remove', () => {
    it('should delete body', async () => {
      mockDeleteUseCase.execute.mockReturnValue(of(undefined))

      await controller.remove('building-id', 'body-id')

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith('body-id')
    })
  })
})
