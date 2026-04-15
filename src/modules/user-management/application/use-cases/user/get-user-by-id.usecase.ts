import { type Observable, of, throwError } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import type { IUserServicePort } from '@/modules/user-management/application/ports/i-user.service.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

export class GetUserByIdUseCase {
  constructor(private readonly userService: IUserServicePort) {}

  execute(
    userId: string
  ): Observable<{ userId: string; email: string; role: string; isActive: boolean }> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'))
    }

    return this.userService.getUserById(UserId.create(userId)).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('User not found'))
        }
        return of({
          userId: user.id.value,
          email: user.email.value,
          role: user.role,
          isActive: user.isActive,
        })
      }),
      catchError((err) => throwError(() => err))
    )
  }
}
