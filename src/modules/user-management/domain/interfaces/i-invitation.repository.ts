import type { Observable } from 'rxjs'
import type { Invitation } from '../../entities/invitation.entity'
import type { InvitationStatus } from '../../enums/invitation-status.enum'
import type { Email } from '../../value-objects/email.value-object'
import type { UserId } from '../../value-objects/user-id.value-object'

export interface IInvitationRepository {
  findById(id: string): Observable<Invitation | null>
  findByToken(token: string): Observable<Invitation | null>
  findByEmail(email: Email, status?: InvitationStatus): Observable<Invitation | null>
  findByCreator(createdById: UserId): Observable<Invitation[]>
  save(invitation: Invitation): Observable<Invitation>
  update(invitation: Invitation): Observable<Invitation>
  delete(id: string): Observable<void>
  deleteExpired(): Observable<number>
}
