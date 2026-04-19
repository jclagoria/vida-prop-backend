import { winstonConfig } from '@common/logging/winston.config'
import { RedisCacheModule, RedisCoreModule } from '@common/redis/redis.module'
import { HealthModule } from '@health/health.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { BuildingManagementModule } from './modules/building-management/presentation/building-management.module'
import { UserManagementModule } from './modules/user-management/presentation/user-management.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonModule.forRoot(winstonConfig),
    RedisCoreModule,
    RedisCacheModule,
    HealthModule,
    UserManagementModule,
    BuildingManagementModule,
  ],
})
export class AppModule {}
