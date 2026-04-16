import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service'
import type { User } from '@/modules/user-management/domain/entities/user.entity'

@Injectable()
export class AcceptInvitationUseCase {
  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(token: string, password: string): Observable<User> {
    return this.invitationService.accept(token, password)
  }
}
