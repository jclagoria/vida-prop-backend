import { Injectable, Logger } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'

@Injectable()
export class CancelInvitationUseCase {
  private readonly logger = new Logger(CancelInvitationUseCase.name)

  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(id: string): Observable<Invitation> {
    return this.invitationService.cancel(id).pipe(
      tap((invitation) => {
        this.logger.log('Invitation cancelled', {
          useCase: 'CancelInvitationUseCase',
          operation: 'execute',
          invitationId: id,
        })
      }),
      catchError((error) => {
        this.logger.error(
          'Invitation cancellation failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'CancelInvitationUseCase',
            operation: 'execute',
            invitationId: id,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        throw error
      })
    )
  }
}
