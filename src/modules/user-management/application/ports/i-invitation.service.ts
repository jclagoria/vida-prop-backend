import type { Observable } from 'rxjs'
import type { Invitation } from '../../domain/entities/invitation.entity'
import type { User } from '../../domain/entities/user.entity'
import type { CreateInvitationDto } from '../dto/create-invitation.dto'

export interface IInvitationServicePort {
  create(dto: CreateInvitationDto, createdById: string): Observable<Invitation>
  accept(token: string, password: string): Observable<User>
  cancel(id: string): Observable<Invitation>
  resend(id: string): Observable<Invitation>
  findById(id: string): Observable<Invitation | null>
  findByToken(token: string): Observable<Invitation | null>
}
