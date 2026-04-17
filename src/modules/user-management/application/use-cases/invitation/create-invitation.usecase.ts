import { Injectable, Logger } from '@nestjs/common'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap, tap } from 'rxjs/operators'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import type { InvitationDomainService } from '@/modules/user-management/domain/services/invitation.domain-service'
import type { CreateInvitationDto } from '../../dto/create-invitation.dto'
import type { IInvitationServicePort } from '../../ports/i-invitation.service'

@Injectable()
export class CreateInvitationUseCase {
  private readonly logger = new Logger(CreateInvitationUseCase.name)

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
      this.logger.warn('Invitation creation validation failed', {
        useCase: 'CreateInvitationUseCase',
        operation: 'execute',
        errors: validation.errors,
      })
      return throwError(() => new Error(validation.errors.join(', ')))
    }

    return this.invitationService.create(dto, createdById).pipe(
      tap((invitation) => {
        this.logger.log('Invitation created', {
          useCase: 'CreateInvitationUseCase',
          operation: 'execute',
          invitationId: invitation.id,
        })
      }),
      catchError((error) => {
        this.logger.error(
          'Invitation creation failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'CreateInvitationUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        throw error
      })
    )
  }
}
