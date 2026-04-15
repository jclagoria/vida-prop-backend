import { type Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service.js'

export interface CancelInvitationResult {
  invitationId: string
  status: string
}

export class CancelInvitationUseCase {
  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(invitationId: string, userId: string): Observable<CancelInvitationResult> {
    if (!invitationId || !userId) {
      return throwError(() => new Error('Invitation ID and user ID are required'))
    }

    return this.invitationService.cancelInvitation(invitationId, userId).pipe(
      map((invitation) => ({
        invitationId: invitation.id,
        status: invitation.status,
      })),
      catchError((err) => throwError(() => err))
    )
  }
}
