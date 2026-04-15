import { type Observable, throwError } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import type { IAuthServicePort } from '@/modules/user-management/application/ports/i-auth.service.js'

export interface RefreshTokenResult {
  accessToken: string
  refreshToken: string
}

export class RefreshTokenUseCase {
  constructor(private readonly authService: IAuthServicePort) {}

  execute(refreshToken: string): Observable<RefreshTokenResult> {
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token is required'))
    }

    return this.authService.refreshToken(refreshToken).pipe(
      map((tokens) => ({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })),
      catchError((err) => throwError(() => err))
    )
  }
}
