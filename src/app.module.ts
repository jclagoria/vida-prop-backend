import { HealthModule } from '@health/health.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserManagementModule } from '@/modules/user-management/presentation/user-management.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    UserManagementModule,
  ],
})
export class AppModule {}
