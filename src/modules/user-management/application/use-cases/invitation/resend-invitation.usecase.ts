import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import type { IInvitationServicePort } from '../../ports/i-invitation.service'

@Injectable()
export class ResendInvitationUseCase {
  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(id: string): Observable<Invitation> {
    return this.invitationService.resend(id)
  }
}
