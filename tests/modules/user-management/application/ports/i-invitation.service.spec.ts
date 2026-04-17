import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import { INVITATION_SERVICE_PORT } from '@/modules/user-management/application/ports/i-invitation.service'

describe('IInvitationServicePort', () => {
  let mockService: IInvitationServicePort

  beforeEach(() => {
    mockService = {
      create: jest.fn(),
      accept: jest.fn(),
      cancel: jest.fn(),
      resend: jest.fn(),
      findById: jest.fn(),
      findByToken: jest.fn(),
      findMany: jest.fn(),
    }
  })

  describe('interface contract', () => {
    it('should have create method', () => {
      expect(typeof mockService.create).toBe('function')
    })

    it('should have accept method', () => {
      expect(typeof mockService.accept).toBe('function')
    })

    it('should have cancel method', () => {
      expect(typeof mockService.cancel).toBe('function')
    })

    it('should have resend method', () => {
      expect(typeof mockService.resend).toBe('function')
    })

    it('should have findById method', () => {
      expect(typeof mockService.findById).toBe('function')
    })

    it('should have findByToken method', () => {
      expect(typeof mockService.findByToken).toBe('function')
    })

    it('should have findMany method', () => {
      expect(typeof mockService.findMany).toBe('function')
    })
  })

  describe('INVITATION_SERVICE_PORT constant', () => {
    it('should be defined', () => {
      expect(INVITATION_SERVICE_PORT).toBeDefined()
    })
  })
})
