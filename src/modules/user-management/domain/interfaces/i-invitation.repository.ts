import type { Observable } from 'rxjs'
import type { Invitation } from '../entities/invitation.entity'

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IInvitationRepository {
  findById(id: string): Observable<Invitation | null>
  findByToken(token: string): Observable<Invitation | null>
  findByEmail(email: string): Observable<Invitation | null>
  findMany(options: {
    page: number
    limit: number
    status?: string
  }): Observable<PaginatedResult<Invitation>>
  save(invitation: Invitation): Observable<Invitation>
  update(invitation: Invitation): Observable<Invitation>
  delete(id: string): Observable<void>
  updateManyExpired(): Observable<{ count: number }>
}
