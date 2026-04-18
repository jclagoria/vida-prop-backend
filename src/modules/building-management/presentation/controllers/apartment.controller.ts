import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post as NestPost,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { firstValueFrom, throwError } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import type { CreateApartmentDto } from '@/modules/building-management/application/dto/create-apartment.dto'
import type { BulkCreateApartmentsUseCase } from '@/modules/building-management/application/use-cases/apartment/bulk-create-apartments.usecase'
import type { CreateApartmentUseCase } from '@/modules/building-management/application/use-cases/apartment/create-apartment.usecase'
import type { GetApartmentByIdentifierUseCase } from '@/modules/building-management/application/use-cases/apartment/get-apartment-by-identifier.usecase'
import type { CsvParserService } from '@/modules/building-management/infrastructure/services/csv-parser.service'
import { JwtAuthGuard } from '@/modules/user-management/infrastructure/auth/jwt-auth.guard'

const mapApartmentToResponse = (apartment: {
  id: { toString(): string }
  floorId: { toString(): string }
  unitNumber: string
  uniqueIdentifier: { toString(): string }
  totalRooms: number
  totalArea: number
  status: string
}) => ({
  id: apartment.id.toString(),
  floorId: apartment.floorId.toString(),
  unitNumber: apartment.unitNumber,
  uniqueIdentifier: apartment.uniqueIdentifier.toString(),
  totalRooms: apartment.totalRooms,
  totalArea: apartment.totalArea,
  status: apartment.status,
})

@ApiTags('Apartments')
@Controller('api/v1/apartments')
@UseGuards(JwtAuthGuard)
export class ApartmentController {
  constructor(
    private readonly createApartmentUseCase: CreateApartmentUseCase,
    private readonly getApartmentByIdentifierUseCase: GetApartmentByIdentifierUseCase,
    private readonly bulkCreateApartmentsUseCase: BulkCreateApartmentsUseCase,
    private readonly csvParserService: CsvParserService
  ) {}

  @NestPost()
  @ApiOperation({ summary: 'Create apartment' })
  @ApiResponse({ status: 201, description: 'Apartment created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() dto: CreateApartmentDto & { floorId: string }
  ): Promise<ReturnType<typeof mapApartmentToResponse>> {
    return firstValueFrom(
      this.createApartmentUseCase.execute(dto.floorId, dto).pipe(
        map(mapApartmentToResponse),
        catchError((error) => throwError(() => new BadRequestException(error.message)))
      )
    )
  }

  @Get('by-identifier/:uniqueId')
  @ApiOperation({ summary: 'Get apartment by unique identifier' })
  @ApiResponse({ status: 200, description: 'Apartment retrieved' })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  async findByIdentifier(
    @Param('uniqueId') uniqueId: string
  ): Promise<ReturnType<typeof mapApartmentToResponse>> {
    return firstValueFrom(
      this.getApartmentByIdentifierUseCase.execute(uniqueId).pipe(
        map(mapApartmentToResponse),
        catchError((error) => throwError(() => new NotFoundException(error.message)))
      )
    )
  }

  @NestPost('bulk-import')
  @ApiOperation({ summary: 'Bulk import apartments from CSV' })
  @ApiResponse({ status: 201, description: 'Apartments imported' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async bulkImport(@Body() body: { csv: string }): Promise<{ count: number }> {
    return firstValueFrom(
      this.csvParserService.parseApartmentCsv(body.csv).pipe(
        switchMap((apartments) => this.bulkCreateApartmentsUseCase.execute(apartments)),
        map((results) => ({ count: results.length })),
        catchError((error) => throwError(() => new BadRequestException(error.message)))
      )
    )
  }
}
