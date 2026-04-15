import { type Observable, of, throwError } from 'rxjs'
import { map, switchMap, tap } from 'rxjs/operators'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity.js'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum.js'
import type { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import type { IInvitationRepository } from '@/modules/user-management/domain/interfaces/i-invitation.repository.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import type { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

export interface CreateInvitationParams {
  email: string
  role: UserRole
  createdById: UserId
  apartmentId?: string
  buildingId?: string
}

export class InvitationDomainService {
  constructor(private readonly invitationRepository: IInvitationRepository) {}

  createInvitation(params: CreateInvitationParams): Observable<Invitation> {
    const email = Email.create(params.email)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    const token = crypto.randomUUID()

    return this.invitationRepository.findByEmail(email, InvitationStatus.PENDING).pipe(
      switchMap((existing) => {
        if (existing) {
          return throwError(() => new Error('Pending invitation already exists for this email'))
        }
        const invitation = Invitation.create({
          id: crypto.randomUUID(),
          email,
          role: params.role,
          token,
          status: InvitationStatus.PENDING,
          expiresAt,
          createdById: params.createdById,
          apartmentId: params.apartmentId,
          buildingId: params.buildingId,
          createdAt: new Date(),
        })
        return this.invitationRepository.save(invitation)
      })
    )
  }

  acceptInvitation(token: string): Observable<Invitation> {
    return this.invitationRepository.findByToken(token).pipe(
      switchMap((invitation) => {
        if (!invitation) {
          return throwError(() => new Error('Invitation not found'))
        }
        try {
          invitation.accept()
        } catch (err) {
          return throwError(() => err as Error)
        }
        return this.invitationRepository.update(invitation)
      })
    )
  }

  cancelInvitation(id: string): Observable<Invitation> {
    return this.invitationRepository.findById(id).pipe(
      switchMap((invitation) => {
        if (!invitation) {
          return throwError(() => new Error('Invitation not found'))
        }
        try {
          invitation.cancel()
        } catch (err) {
          return throwError(() => err as Error)
        }
        return this.invitationRepository.update(invitation)
      })
    )
  }

  resendInvitation(id: string): Observable<Invitation> {
    const newExpiresAt = new Date()
    newExpiresAt.setDate(newExpiresAt.getDate() + 7)
    const newToken = crypto.randomUUID()

    return this.invitationRepository.findById(id).pipe(
      switchMap((invitation) => {
        if (!invitation) {
          return throwError(() => new Error('Invitation not found'))
        }
        if (invitation.status !== InvitationStatus.PENDING) {
          return throwError(() => new Error('Only pending invitations can be resent'))
        }
        const updated = Invitation.create({
          ...{
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            token: newToken,
            status: InvitationStatus.PENDING,
            expiresAt: newExpiresAt,
            createdById: invitation.createdById,
            apartmentId: invitation.apartmentId,
            buildingId: invitation.buildingId,
            createdAt: invitation.createdAt,
          },
        })
        return this.invitationRepository.update(updated)
      })
    )
  }

  cleanupExpired(): Observable<number> {
    return this.invitationRepository.deleteExpired()
  }
}
