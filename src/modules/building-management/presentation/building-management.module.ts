import { Module } from '@nestjs/common'
import type { IApartmentServicePort } from '../application/ports/i-apartment.service'
import type { IBodyServicePort } from '../application/ports/i-body.service'
import type { IBuildingServicePort } from '../application/ports/i-building.service'
import type { IFloorServicePort } from '../application/ports/i-floor.service'
import { BulkCreateApartmentsUseCase } from '../application/use-cases/apartment/bulk-create-apartments.usecase'
import { CreateApartmentUseCase } from '../application/use-cases/apartment/create-apartment.usecase'
import { GetApartmentByIdentifierUseCase } from '../application/use-cases/apartment/get-apartment-by-identifier.usecase'
import { CreateBodyUseCase } from '../application/use-cases/body/create-body.usecase'
import { DeleteBodyUseCase } from '../application/use-cases/body/delete-body.usecase'
import { CreateBuildingUseCase } from '../application/use-cases/building/create-building.usecase'
import { DeleteBuildingUseCase } from '../application/use-cases/building/delete-building.usecase'
import { GetBuildingUseCase } from '../application/use-cases/building/get-building.usecase'
import { UpdateBuildingUseCase } from '../application/use-cases/building/update-building.usecase'
import { FilterBuildingsUseCase } from '../application/use-cases/common/filter-buildings.usecase'
import { GetBuildingStructureUseCase } from '../application/use-cases/common/get-building-structure.usecase'
import { CreateFloorUseCase } from '../application/use-cases/floor/create-floor.usecase'
import { IApartmentRepository } from '../domain/interfaces/i-apartment.repository'
import { IBodyRepository } from '../domain/interfaces/i-body.repository'
import { IBuildingRepository } from '../domain/interfaces/i-building.repository'
import { IFloorRepository } from '../domain/interfaces/i-floor.repository'
import { PrismaApartmentRepository } from '../infrastructure/repositories/prisma-apartment.repository'
import { PrismaBodyRepository } from '../infrastructure/repositories/prisma-body.repository'
import { PrismaBuildingRepository } from '../infrastructure/repositories/prisma-building.repository'
import { PrismaFloorRepository } from '../infrastructure/repositories/prisma-floor.repository'
import { CsvParserService } from '../infrastructure/services/csv-parser.service'
import { ApartmentController } from './controllers/apartment.controller'
import { BodyController } from './controllers/body.controller'
import { BuildingController } from './controllers/building.controller'
import { FloorController } from './controllers/floor.controller'

@Module({
  controllers: [BuildingController, BodyController, FloorController, ApartmentController],
  providers: [
    CreateBuildingUseCase,
    UpdateBuildingUseCase,
    DeleteBuildingUseCase,
    GetBuildingUseCase,
    FilterBuildingsUseCase,
    GetBuildingStructureUseCase,
    CreateBodyUseCase,
    DeleteBodyUseCase,
    CreateFloorUseCase,
    CreateApartmentUseCase,
    GetApartmentByIdentifierUseCase,
    BulkCreateApartmentsUseCase,
    CsvParserService,
    {
      provide: IBuildingRepository,
      useClass: PrismaBuildingRepository,
    },
    {
      provide: IBodyRepository,
      useClass: PrismaBodyRepository,
    },
    {
      provide: IFloorRepository,
      useClass: PrismaFloorRepository,
    },
    {
      provide: IApartmentRepository,
      useClass: PrismaApartmentRepository,
    },
  ],
  exports: [IBuildingRepository, IBodyRepository, IFloorRepository, IApartmentRepository],
})
export class BuildingManagementModule {}
