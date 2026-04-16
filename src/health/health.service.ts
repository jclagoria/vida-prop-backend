import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name)
  private readonly startTime = Date.now()

  check() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000)
    this.logger.log('Health check performed')
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime,
    }
  }
}
