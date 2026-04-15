import { type Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { UpdateUserDto } from '@/modules/user-management/application/dto/update-user.dto.js'
import type { IUserServicePort } from '@/modules/user-management/application/ports/i-user.service.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

export class UpdateUserUseCase {
  constructor(private readonly userService: IUserServicePort) {}

  execute(
    userId: string,
    dto: UpdateUserDto
  ): Observable<{ userId: string; email?: string; role?: string; isActive?: boolean }> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'))
    }

    const updates: { email?: string; role?: UserRole; isActive?: boolean } = {}

    if (dto.email) {
      updates.email = dto.email
    }

    if (dto.role) {
      const role = dto.role.toUpperCase() as UserRole
      if (!Object.values(UserRole).includes(role)) {
        return throwError(() => new Error('Invalid role'))
      }
      updates.role = role
    }

    if (dto.isActive !== undefined) {
      updates.isActive = dto.isActive
    }

    return this.userService.updateUser(UserId.create(userId), updates).pipe(
      map((user) => ({
        userId: user.id.value,
        email: user.email.value,
        role: user.role,
        isActive: user.isActive,
      })),
      catchError((err) => throwError(() => err))
    )
  }
}
