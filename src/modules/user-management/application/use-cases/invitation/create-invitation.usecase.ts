import { Injectable } from '@nestjs/common'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import type { InvitationDomainService } from '@/modules/user-management/domain/services/invitation.domain-service'
import type { CreateInvitationDto } from '../../dto/create-invitation.dto'
import type { IInvitationServicePort } from '../../ports/i-invitation.service'

@Injectable()
export class CreateInvitationUseCase {
  constructor(
    private readonly invitationService: IInvitationServicePort,
    private readonly domainService: InvitationDomainService
  ) {}

  execute(dto: CreateInvitationDto, createdById: string): Observable<Invitation> {
    const validation = this.domainService.validateInvitationCreation({
      email: dto.email,
      role: dto.role,
      createdById,
      apartmentId: dto.apartmentId,
      buildingId: dto.buildingId,
    })

    if (!validation.valid) {
      return throwError(() => new Error(validation.errors.join(', ')))
    }

    return this.invitationService.create(dto, createdById)
  }
}
