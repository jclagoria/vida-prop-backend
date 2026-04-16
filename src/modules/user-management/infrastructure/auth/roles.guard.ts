import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common'
import type { Reflector } from '@nestjs/core'
import { UserRole } from '../../domain/enums/user-role.enum'
import { ROLES_KEY } from './decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()
    if (!user?.role) {
      return false
    }

    return requiredRoles.some((role) => this.hasRole(user.role, role))
  }

  private hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const hierarchy = [
      UserRole.TENANT,
      UserRole.OWNER,
      UserRole.SUPERINTENDENT,
      UserRole.ACCOUNTANT,
      UserRole.ADMIN,
    ]
    return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole)
  }
}
