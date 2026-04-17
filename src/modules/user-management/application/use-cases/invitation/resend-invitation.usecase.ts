import { Injectable, Logger } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import type { IInvitationServicePort } from '../../ports/i-invitation.service'

@Injectable()
export class ResendInvitationUseCase {
  private readonly logger = new Logger(ResendInvitationUseCase.name)

  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(id: string): Observable<Invitation> {
    return this.invitationService.resend(id).pipe(
      tap((invitation) => {
        this.logger.log('Invitation resent', {
          useCase: 'ResendInvitationUseCase',
          operation: 'execute',
          invitationId: id,
        })
      }),
      catchError((error) => {
        this.logger.error(
          'Invitation resend failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'ResendInvitationUseCase',
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
