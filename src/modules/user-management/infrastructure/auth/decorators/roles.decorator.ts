import { SetMetadata } from '@nestjs/common'
import type { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'

export const ROLES_KEY = 'roles'

export function Roles(...roles: UserRole[]): MethodDecorator {
  return SetMetadata(ROLES_KEY, roles)
}
