import type { HealthCheckService } from '@nestjs/terminus'
import { HealthController } from '@/health/health.controller'

describe('HealthController', () => {
  let controller: HealthController
  let mockHealthService: { check: jest.Mock }

  beforeEach(() => {
    mockHealthService = {
      check: jest.fn().mockResolvedValue({ status: 'ok' }),
    }
    controller = new HealthController(mockHealthService as unknown as HealthCheckService)
  })

  describe('check', () => {
    it('should return health check result', async () => {
      const result = await controller.check()

      expect(result).toEqual({ status: 'ok' })
      expect(mockHealthService.check).toHaveBeenCalledWith([])
    })
  })
})
