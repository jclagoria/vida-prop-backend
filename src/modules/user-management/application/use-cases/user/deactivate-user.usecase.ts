import { Injectable, Logger } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import type { IUserServicePort } from '@/modules/user-management/application/ports/i-user.service'
import type { User } from '@/modules/user-management/domain/entities/user.entity'

@Injectable()
export class DeactivateUserUseCase {
  private readonly logger = new Logger(DeactivateUserUseCase.name)

  constructor(private readonly userService: IUserServicePort) {}

  execute(id: string): Observable<User> {
    return this.userService.deactivate(id).pipe(
      tap((user) => {
        this.logger.log('User deactivated', {
          useCase: 'DeactivateUserUseCase',
          operation: 'execute',
          userId: id,
        })
      }),
      catchError((error) => {
        this.logger.error(
          'User deactivation failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'DeactivateUserUseCase',
            operation: 'execute',
            userId: id,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        throw error
      })
    )
  }
}
