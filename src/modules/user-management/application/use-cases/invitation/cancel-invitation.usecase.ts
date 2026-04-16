import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'

@Injectable()
export class CancelInvitationUseCase {
  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(id: string): Observable<Invitation> {
    return this.invitationService.cancel(id)
  }
}
