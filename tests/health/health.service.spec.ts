import { HealthService } from '@/health/health.service'

describe('HealthService', () => {
  let service: HealthService

  beforeEach(() => {
    service = new HealthService()
  })

  describe('check', () => {
    it('should return health status', () => {
      const result = service.check()

      expect(result.status).toBe('OK')
      expect(result.timestamp).toBeDefined()
      expect(result.uptime).toBeGreaterThanOrEqual(0)
    })

    it('should return valid timestamp format', () => {
      const result = service.check()
      const date = new Date(result.timestamp)

      expect(date.getTime()).toBeGreaterThan(0)
    })

    it('should return increasing uptime', () => {
      const result1 = service.check()
      const uptime1 = result1.uptime

      const result2 = service.check()
      const uptime2 = result2.uptime

      expect(uptime2).toBeGreaterThanOrEqual(uptime1)
    })
  })
})
