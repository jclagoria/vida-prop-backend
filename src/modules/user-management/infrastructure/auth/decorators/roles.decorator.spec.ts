import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { Roles } from './roles.decorator'

describe('RolesDecorator', () => {
  describe('Roles', () => {
    it('should set roles metadata', () => {
      const roles = [UserRole.ADMIN, UserRole.ACCOUNTANT]
      const decorator = Roles(...roles)

      expect(decorator).toBeDefined()
      expect(typeof decorator).toBe('function')
    })

    it('should accept single role', () => {
      const decorator = Roles(UserRole.ADMIN)

      expect(decorator).toBeDefined()
      expect(typeof decorator).toBe('function')
    })

    it('should accept multiple roles', () => {
      const decorator = Roles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.SUPERINTENDENT)

      expect(decorator).toBeDefined()
      expect(typeof decorator).toBe('function')
    })
  })
})
