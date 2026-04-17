import { Inject, Injectable, Logger } from '@nestjs/common'
import { Invitation } from '../entities/invitation.entity'
import type { User } from '../entities/user.entity'
import { InvitationStatus } from '../enums/invitation-status.enum'
import { UserRole } from '../enums/user-role.enum'

export interface CreateInvitationInput {
  email: string
  role: UserRole
  createdById: string
  apartmentId?: string
  buildingId?: string
}

const DEFAULT_EXPIRY_DAYS = 7

export const DOMAIN_LOGGER = 'DomainLogger'

@Injectable()
export class InvitationDomainService {
  private readonly logger = new Logger(InvitationDomainService.name)

  createInvitation(input: CreateInvitationInput): Invitation {
    this.logger.debug('Creating invitation', {
      service: 'InvitationDomainService',
      operation: 'createInvitation',
      email: input.email,
      role: input.role,
    })

    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + DEFAULT_EXPIRY_DAYS)

    return new Invitation({
      id: crypto.randomUUID(),
      email: input.email.toLowerCase(),
      role: input.role,
      token: this.generateToken(),
      status: InvitationStatus.PENDING,
      expiresAt,
      createdAt: now,
      createdById: input.createdById,
      apartmentId: input.apartmentId,
      buildingId: input.buildingId,
    })
  }

  private generateToken(): string {
    return crypto.randomUUID()
  }

  canInviteUser(inviter: User, roleToInvite: UserRole): boolean {
    this.logger.debug('Checking invitation permission', {
      service: 'InvitationDomainService',
      operation: 'canInviteUser',
      inviterRole: inviter.role,
      requestedRole: roleToInvite,
    })

    if (inviter.isAdmin()) {
      return true
    }

    if (inviter.role === UserRole.OWNER && roleToInvite === UserRole.TENANT) {
      return true
    }

    this.logger.warn('Invitation denied', {
      service: 'InvitationDomainService',
      operation: 'canInviteUser',
      inviterRole: inviter.role,
      requestedRole: roleToInvite,
    })

    return false
  }

  canAcceptInvitation(invitation: Invitation): boolean {
    return invitation.canBeAccepted()
  }

  calculateExpiry(days: number = DEFAULT_EXPIRY_DAYS): Date {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)
    return expiresAt
  }

  isInvitationValid(invitation: Invitation): boolean {
    return invitation.isPending() && !invitation.isExpired()
  }

  validateInvitationCreation(input: CreateInvitationInput): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!input.email?.includes('@')) {
      errors.push('Invalid email format')
    }

    if (!input.createdById) {
      errors.push('Creator ID is required')
    }

    if (!Object.values(UserRole).includes(input.role)) {
      errors.push('Invalid role')
    }

    if (errors.length > 0) {
      this.logger.warn('Invitation validation failed', {
        service: 'InvitationDomainService',
        operation: 'validateInvitationCreation',
        errors,
      })
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
