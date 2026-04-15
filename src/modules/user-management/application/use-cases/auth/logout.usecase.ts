import { catchError, type Observable, of, switchMap, throwError } from 'rxjs'
import type { IAuthServicePort } from '@/modules/user-management/application/ports/i-auth.service.js'

export class LogoutUseCase {
  constructor(private readonly authService: IAuthServicePort) {}

  execute(refreshToken: string): Observable<void> {
    if (!refreshToken) {
      return of(undefined)
    }

    return this.authService.logout(refreshToken).pipe(
      switchMap(() => of(undefined)),
      catchError((err) => throwError(() => err))
    )
  }
}
