import type { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { RolesGuard } from './roles.guard'

describe('RolesGuard', () => {
  let guard: RolesGuard
  let reflector: Reflector

  const createMockContext = (userRole: UserRole): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: userRole } }),
      }),
    } as unknown as ExecutionContext
  }

  beforeEach(() => {
    reflector = new Reflector()
    guard = new RolesGuard(reflector)
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  describe('canActivate', () => {
    it('should allow ADMIN to access ADMIN-only endpoint', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN])
      const context = createMockContext(UserRole.ADMIN)

      const result = guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('should allow ACCOUNTANT to access ACCOUNTANT endpoint', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ACCOUNTANT])
      const context = createMockContext(UserRole.ACCOUNTANT)

      const result = guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('should allow SUPERINTENDENT to access SUPERINTENDENT endpoint', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserRole.SUPERINTENDENT])
      const context = createMockContext(UserRole.SUPERINTENDENT)

      const result = guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('should allow OWNER to access OWNER endpoint', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserRole.OWNER])
      const context = createMockContext(UserRole.OWNER)

      const result = guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('should allow TENANT to access TENANT endpoint', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserRole.TENANT])
      const context = createMockContext(UserRole.TENANT)

      const result = guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('should allow higher role to access lower role endpoint', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserRole.TENANT])
      const context = createMockContext(UserRole.ADMIN)

      const result = guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('should deny TENANT access to ADMIN-only endpoint', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN])
      const context = createMockContext(UserRole.TENANT)

      const result = guard.canActivate(context)

      expect(result).toBe(false)
    })

    it('should deny OWNER access to ACCOUNTANT endpoint', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ACCOUNTANT])
      const context = createMockContext(UserRole.OWNER)

      const result = guard.canActivate(context)

      expect(result).toBe(false)
    })

    it('should deny SUPERINTENDENT access to ADMIN endpoint', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN])
      const context = createMockContext(UserRole.SUPERINTENDENT)

      const result = guard.canActivate(context)

      expect(result).toBe(false)
    })

    it('should allow access when no roles are required', () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined)
      const context = createMockContext(UserRole.TENANT)

      const result = guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('should allow access when multiple roles and user has one', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN, UserRole.ACCOUNTANT])
      const context = createMockContext(UserRole.ADMIN)

      const result = guard.canActivate(context)

      expect(result).toBe(true)
    })
  })
})
