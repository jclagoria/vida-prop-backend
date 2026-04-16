import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common'
import type { Reflector } from '@nestjs/core'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { ROLES_KEY } from './decorators/roles.decorator'

const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.ADMIN]: 5,
  [UserRole.ACCOUNTANT]: 4,
  [UserRole.SUPERINTENDENT]: 3,
  [UserRole.OWNER]: 2,
  [UserRole.TENANT]: 1,
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler())

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user?.role) {
      return false
    }

    const userRoleLevel = ROLE_HIERARCHY[user.role as UserRole]

    return requiredRoles.some((requiredRole) => {
      const requiredRoleLevel = ROLE_HIERARCHY[requiredRole]
      return userRoleLevel >= requiredRoleLevel
    })
  }
}
