import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import type { PaginatedResult } from '@/modules/user-management/domain/interfaces/i-invitation.repository'
import type { IInvitationServicePort } from '../../ports/i-invitation.service'

@Injectable()
export class GetAllInvitationsUseCase {
  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(options: {
    page: number
    limit: number
    status?: string
  }): Observable<PaginatedResult<Invitation>> {
    const page = Math.max(1, options.page || 1)
    const limit = Math.min(100, Math.max(1, options.limit || 20))

    return this.invitationService.findMany({ page, limit, status: options.status })
  }
}
