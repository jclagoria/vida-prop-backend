import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtAuthGuard } from '@/modules/user-management/infrastructure/auth/jwt-auth.guard'
import { RolesGuard } from '@/modules/user-management/infrastructure/auth/roles.guard'
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
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
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
    JwtAuthGuard,
    RolesGuard,
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
})
export class BuildingManagementModule {}
