import { Injectable } from '@nestjs/common'
import { type Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import type { IInvitationServicePort } from '../../ports/i-invitation.service'

@Injectable()
export class GetInvitationByTokenUseCase {
  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(token: string): Observable<Invitation> {
    return this.invitationService.findByToken(token).pipe(
      catchError((error) =>
        throwError(() => new Error(`Failed to find invitation: ${error.message}`))
      ),
      map((invitation) => {
        if (!invitation) {
          throw new Error('Invitation not found')
        }
        return invitation
      })
    )
  }
}
