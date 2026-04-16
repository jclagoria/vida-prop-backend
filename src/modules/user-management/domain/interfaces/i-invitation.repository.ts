import type { Observable } from 'rxjs'
import type { Invitation } from '../entities/invitation.entity'

export interface IInvitationRepository {
  findById(id: string): Observable<Invitation | null>
  findByToken(token: string): Observable<Invitation | null>
  findByEmail(email: string): Observable<Invitation | null>
  save(invitation: Invitation): Observable<Invitation>
  update(invitation: Invitation): Observable<Invitation>
  delete(id: string): Observable<void>
}
