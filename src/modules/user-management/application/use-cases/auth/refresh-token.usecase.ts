import { Injectable, Logger } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import type {
  AuthTokens,
  IAuthServicePort,
} from '@/modules/user-management/application/ports/i-auth.service'

@Injectable()
export class RefreshTokenUseCase {
  private readonly logger = new Logger(RefreshTokenUseCase.name)

  constructor(private readonly authService: IAuthServicePort) {}

  execute(refreshToken: string): Observable<AuthTokens> {
    return this.authService.refreshToken(refreshToken).pipe(
      tap(() => {
        this.logger.log('Token refreshed', {
          useCase: 'RefreshTokenUseCase',
          operation: 'execute',
        })
      }),
      catchError((error) => {
        this.logger.error(
          'Token refresh failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'RefreshTokenUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        throw error
      })
    )
  }
}
