import type { Observable } from 'rxjs'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity.js'
import type { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum.js'
import type { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import type { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

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
