import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post as NestPost,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { firstValueFrom, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { CreateBodyDto } from '@/modules/building-management/application/dto/create-body.dto'
import type { CreateBodyUseCase } from '@/modules/building-management/application/use-cases/body/create-body.usecase'
import type { DeleteBodyUseCase } from '@/modules/building-management/application/use-cases/body/delete-body.usecase'
import { JwtAuthGuard } from '@/modules/user-management/infrastructure/auth/jwt-auth.guard'

const mapBodyToResponse = (body: {
  id: { toString(): string }
  buildingId: { toString(): string }
  name: string
}) => ({
  id: body.id.toString(),
  buildingId: body.buildingId.toString(),
  name: body.name,
})

@ApiTags('Bodies')
@Controller('api/v1/buildings/:buildingId/bodies')
@UseGuards(JwtAuthGuard)
export class BodyController {
  constructor(
    private readonly createBodyUseCase: CreateBodyUseCase,
    private readonly deleteBodyUseCase: DeleteBodyUseCase
  ) {}

  @NestPost()
  @ApiOperation({ summary: 'Create body under building' })
  @ApiResponse({ status: 201, description: 'Body created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Param('buildingId') buildingId: string,
    @Param() dto: CreateBodyDto
  ): Promise<ReturnType<typeof mapBodyToResponse>> {
    return firstValueFrom(
      this.createBodyUseCase.execute(buildingId, dto).pipe(
        map(mapBodyToResponse),
        catchError((error) =>
          throwError(
            () =>
              new BadRequestException({
                message: error.message,
                code: 'BODY_VALIDATION_ERROR',
              })
          )
        )
      )
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete body' })
  @ApiResponse({ status: 204, description: 'Body deleted' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async remove(@Param('buildingId') _buildingId: string, @Param('id') id: string): Promise<void> {
    return firstValueFrom(
      this.deleteBodyUseCase.execute(id).pipe(
        catchError((error) =>
          throwError(
            () =>
              new BadRequestException({
                message: error.message,
                code: 'BODY_VALIDATION_ERROR',
              })
          )
        )
      )
    )
  }
}
