import { Injectable, Logger } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import type { User } from '@/modules/user-management/domain/entities/user.entity'

@Injectable()
export class AcceptInvitationUseCase {
  private readonly logger = new Logger(AcceptInvitationUseCase.name)

  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(token: string, password: string): Observable<User> {
    return this.invitationService.accept(token, password).pipe(
      tap((user) => {
        this.logger.log('Invitation accepted', {
          useCase: 'AcceptInvitationUseCase',
          operation: 'execute',
          userId: user.id.toString(),
        })
      }),
      catchError((error) => {
        this.logger.error(
          'Invitation acceptance failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'AcceptInvitationUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        throw error
      })
    )
  }
}
