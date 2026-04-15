import { type Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service.js'

export interface ResendInvitationResult {
  invitationId: string
  expiresAt: Date
}

export class ResendInvitationUseCase {
  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(invitationId: string): Observable<ResendInvitationResult> {
    if (!invitationId) {
      return throwError(() => new Error('Invitation ID is required'))
    }

    return this.invitationService.resendInvitation(invitationId).pipe(
      map((invitation) => ({
        invitationId: invitation.id,
        expiresAt: invitation.expiresAt,
      })),
      catchError((err) => throwError(() => err))
    )
  }
}
