import { type Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service.js'

export interface AcceptInvitationResult {
  invitationId: string
  email: string
  status: string
}

export class AcceptInvitationUseCase {
  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(token: string, password: string): Observable<AcceptInvitationResult> {
    if (!token || !password) {
      return throwError(() => new Error('Token and password are required'))
    }

    return this.invitationService.acceptInvitation(token, password).pipe(
      map((invitation) => ({
        invitationId: invitation.id,
        email: invitation.email.value,
        status: invitation.status,
      })),
      catchError((err) => throwError(() => err))
    )
  }
}
