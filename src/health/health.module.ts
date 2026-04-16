import { Controller, Get, Inject, Module } from '@nestjs/common'
import { HealthService } from './health.service'

@Controller('health')
export class HealthController {
  constructor(@Inject(HealthService) private readonly healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.check()
  }
}

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
