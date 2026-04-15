import { type Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { IUserServicePort } from '@/modules/user-management/application/ports/i-user.service.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

export class DeactivateUserUseCase {
  constructor(private readonly userService: IUserServicePort) {}

  execute(userId: string): Observable<{ userId: string; isActive: boolean }> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'))
    }

    return this.userService.deactivateUser(UserId.create(userId)).pipe(
      map((user) => ({
        userId: user.id.value,
        isActive: user.isActive,
      })),
      catchError((err) => throwError(() => err))
    )
  }
}
