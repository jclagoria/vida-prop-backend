import { Injectable, Logger } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import type { IAuthServicePort } from '@/modules/user-management/application/ports/i-auth.service'

@Injectable()
export class LogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name)

  constructor(private readonly authService: IAuthServicePort) {}

  execute(refreshToken: string): Observable<void> {
    return this.authService.logout(refreshToken).pipe(
      tap(() => {
        this.logger.log('User logged out', {
          useCase: 'LogoutUseCase',
          operation: 'execute',
        })
      })
    )
  }
}
