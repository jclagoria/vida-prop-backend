import { BadRequestException, Controller, Post as NestPost, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { firstValueFrom, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { CreateFloorDto } from '@/modules/building-management/application/dto/create-floor.dto'
import type { CreateFloorUseCase } from '@/modules/building-management/application/use-cases/floor/create-floor.usecase'

const mapFloorToResponse = (floor: {
  id: { toString(): string }
  bodyId: { toString(): string }
  floorNumber: number
}): { id: string; bodyId: string; floorNumber: number } => ({
  id: floor.id.toString(),
  bodyId: floor.bodyId.toString(),
  floorNumber: floor.floorNumber,
})

@ApiTags('Floors')
@Controller('api/v1/buildings/:buildingId/bodies/:bodyId/floors')
export class FloorController {
  constructor(private readonly createFloorUseCase: CreateFloorUseCase) {}

  @NestPost()
  @ApiOperation({ summary: 'Create floor under body' })
  @ApiResponse({ status: 201, description: 'Floor created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Param('bodyId') bodyId: string,
    @Param() dto: CreateFloorDto
  ): Promise<ReturnType<typeof mapFloorToResponse>> {
    return firstValueFrom(
      this.createFloorUseCase.execute(bodyId, dto).pipe(
        map(mapFloorToResponse),
        catchError((error) => throwError(() => new BadRequestException(error.message)))
      )
    )
  }
}
