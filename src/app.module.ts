import { winstonConfig } from '@common/logging/winston.config'
import { HealthModule } from '@health/health.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { UserManagementModule } from './modules/user-management/presentation/user-management.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonModule.forRoot(winstonConfig),
    HealthModule,
    UserManagementModule,
  ],
})
export class AppModule {}
