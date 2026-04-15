import { type Observable, throwError } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import type { CreateInvitationDto } from '@/modules/user-management/application/dto/create-invitation.dto.js'
import type { IInvitationServicePort } from '@/modules/user-management/application/ports/i-invitation.service.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'

export interface CreateInvitationResult {
  invitationId: string
  email: string
  role: string
  expiresAt: Date
}

export class CreateInvitationUseCase {
  constructor(private readonly invitationService: IInvitationServicePort) {}

  execute(dto: CreateInvitationDto, createdById: string): Observable<CreateInvitationResult> {
    if (!dto.email || !dto.role || !createdById) {
      return throwError(() => new Error('Email, role, and creator ID are required'))
    }

    const role = dto.role.toUpperCase() as UserRole
    if (!Object.values(UserRole).includes(role)) {
      return throwError(() => new Error('Invalid role'))
    }

    return this.invitationService
      .createInvitation({
        email: dto.email,
        role,
        createdById,
        apartmentId: dto.apartmentId,
        buildingId: dto.buildingId,
      })
      .pipe(
        map((invitation) => ({
          invitationId: invitation.id,
          email: invitation.email.value,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
        })),
        catchError((err) => throwError(() => err))
      )
  }
}
