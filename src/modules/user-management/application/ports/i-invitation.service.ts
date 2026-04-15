import type { Observable } from 'rxjs'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity.js'
import type { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'

export interface CreateInvitationParams {
  email: string
  role: UserRole
  createdById: string
  apartmentId?: string
  buildingId?: string
  expiresInDays?: number
}

export interface IInvitationServicePort {
  createInvitation(params: CreateInvitationParams): Observable<Invitation>
  acceptInvitation(token: string, password: string): Observable<Invitation>
  cancelInvitation(invitationId: string, userId: string): Observable<Invitation>
  resendInvitation(invitationId: string): Observable<Invitation>
  getInvitationByToken(token: string): Observable<Invitation | null>
  getInvitationById(id: string): Observable<Invitation | null>
}
