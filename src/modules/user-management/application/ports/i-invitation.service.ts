import type { Observable } from 'rxjs'
import type { PaginatedResult } from '@/modules/user-management/domain/interfaces/i-invitation.repository'
import type { Invitation } from '../../domain/entities/invitation.entity'
import type { User } from '../../domain/entities/user.entity'
import type { CreateInvitationDto } from '../dto/create-invitation.dto'

export const INVITATION_SERVICE_PORT = 'INVITATION_SERVICE_PORT' as const

export interface IInvitationServicePort {
  create(dto: CreateInvitationDto, createdById: string): Observable<Invitation>
  accept(token: string, password: string): Observable<User>
  cancel(id: string): Observable<Invitation>
  resend(id: string): Observable<Invitation>
  findById(id: string): Observable<Invitation | null>
  findByToken(token: string): Observable<Invitation | null>
  findMany(options: {
    page: number
    limit: number
    status?: string
  }): Observable<PaginatedResult<Invitation>>
}
