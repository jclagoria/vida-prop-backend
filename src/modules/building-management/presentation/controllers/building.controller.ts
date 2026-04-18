import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { firstValueFrom, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { BuildingFilterDto } from '@/modules/building-management/application/dto/building-filter.dto'
import type { CreateBuildingDto } from '@/modules/building-management/application/dto/create-building.dto'
import type { CreateBuildingUseCase } from '@/modules/building-management/application/use-cases/building/create-building.usecase'
import type { DeleteBuildingUseCase } from '@/modules/building-management/application/use-cases/building/delete-building.usecase'
import type { GetBuildingUseCase } from '@/modules/building-management/application/use-cases/building/get-building.usecase'
import type { UpdateBuildingUseCase } from '@/modules/building-management/application/use-cases/building/update-building.usecase'
import type { FilterBuildingsUseCase } from '@/modules/building-management/application/use-cases/common/filter-buildings.usecase'
import type {
  BuildingStructure,
  GetBuildingStructureUseCase,
} from '@/modules/building-management/application/use-cases/common/get-building-structure.usecase'
import type { Building } from '@/modules/building-management/domain/entities/building.entity'
import { JwtAuthGuard } from '@/modules/user-management/infrastructure/auth/jwt-auth.guard'
import type { PaginatedResponse } from '../dto/paginated-response.dto'

const mapBuildingToResponse = (building: Building) => ({
  id: building.id.toString(),
  name: building.name,
  address: building.address.toString(),
  code: building.code,
  city: building.city,
  country: building.country,
  notes: building.notes,
  createdAt: building.createdAt,
  updatedAt: building.updatedAt,
})

@ApiTags('Buildings')
@Controller('api/v1/buildings')
@UseGuards(JwtAuthGuard)
export class BuildingController {
  constructor(
    private readonly createBuildingUseCase: CreateBuildingUseCase,
    private readonly updateBuildingUseCase: UpdateBuildingUseCase,
    private readonly deleteBuildingUseCase: DeleteBuildingUseCase,
    private readonly getBuildingUseCase: GetBuildingUseCase,
    private readonly filterBuildingsUseCase: FilterBuildingsUseCase,
    private readonly getBuildingStructureUseCase: GetBuildingStructureUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create building' })
  @ApiResponse({ status: 201, description: 'Building created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: CreateBuildingDto): Promise<ReturnType<typeof mapBuildingToResponse>> {
    return firstValueFrom(
      this.createBuildingUseCase.execute(dto).pipe(
        map(mapBuildingToResponse),
        catchError((error) =>
          throwError(
            () =>
              new BadRequestException({
                message: error.message,
                code: 'BUILDING_VALIDATION_ERROR',
              })
          )
        )
      )
    )
  }

  @Get()
  @ApiOperation({ summary: 'List buildings with filters' })
  @ApiResponse({ status: 200, description: 'Buildings retrieved' })
  async findAll(
    @Query() filter: BuildingFilterDto
  ): Promise<PaginatedResponse<ReturnType<typeof mapBuildingToResponse>>> {
    const _page = filter.page || 1
    const _limit = Math.min(filter.limit || 20, 100)

    return firstValueFrom(
      this.filterBuildingsUseCase.execute(filter).pipe(
        map((result) => ({
          ...result,
          data: result.data.map(mapBuildingToResponse),
        })),
        catchError((error) =>
          throwError(
            () =>
              new BadRequestException({
                message: error.message,
                code: 'BUILDING_VALIDATION_ERROR',
              })
          )
        )
      )
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get building by ID' })
  @ApiResponse({ status: 200, description: 'Building retrieved' })
  @ApiResponse({ status: 404, description: 'Building not found' })
  async findOne(@Param('id') id: string): Promise<ReturnType<typeof mapBuildingToResponse>> {
    return firstValueFrom(
      this.getBuildingUseCase.execute(id).pipe(
        map(mapBuildingToResponse),
        catchError((error) =>
          throwError(
            () =>
              new NotFoundException({
                message: error.message,
                code: 'BUILDING_NOT_FOUND',
              })
          )
        )
      )
    )
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update building' })
  @ApiResponse({ status: 200, description: 'Building updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateBuildingDto>
  ): Promise<ReturnType<typeof mapBuildingToResponse>> {
    return firstValueFrom(
      this.updateBuildingUseCase.execute(id, dto).pipe(
        map(mapBuildingToResponse),
        catchError((error) =>
          throwError(
            () =>
              new BadRequestException({
                message: error.message,
                code: 'BUILDING_VALIDATION_ERROR',
              })
          )
        )
      )
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete building' })
  @ApiResponse({ status: 204, description: 'Building deleted' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async remove(@Param('id') id: string): Promise<void> {
    return firstValueFrom(
      this.deleteBuildingUseCase.execute(id).pipe(
        catchError((error) =>
          throwError(
            () =>
              new BadRequestException({
                message: error.message,
                code: 'BUILDING_VALIDATION_ERROR',
              })
          )
        )
      )
    )
  }

  @Get(':id/structure')
  @ApiOperation({ summary: 'Get building structure tree' })
  @ApiResponse({ status: 200, description: 'Building structure retrieved' })
  @ApiResponse({ status: 404, description: 'Building not found' })
  async getStructure(@Param('id') id: string): Promise<BuildingStructure> {
    return firstValueFrom(
      this.getBuildingStructureUseCase.execute(id).pipe(
        catchError((error) =>
          throwError(
            () =>
              new NotFoundException({
                message: error.message,
                code: 'BUILDING_NOT_FOUND',
              })
          )
        )
      )
    )
  }
}
