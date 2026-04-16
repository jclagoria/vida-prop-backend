import { Invitation } from '../../domain/entities/invitation.entity'
import type { InvitationStatus } from '../../domain/enums/invitation-status.enum'
import type { UserRole } from '../../domain/enums/user-role.enum'

interface PrismaInvitation {
  id: string
  email: string
  role: UserRole
  token: string
  status: InvitationStatus
  expiresAt: Date
  createdAt: Date
  createdById: string
  apartmentId?: string
  buildingId?: string
}

export class InvitationMapper {
  static toDomain(prismaInvitation: PrismaInvitation): Invitation {
    return new Invitation({
      id: prismaInvitation.id,
      email: prismaInvitation.email,
      role: prismaInvitation.role,
      token: prismaInvitation.token,
      status: prismaInvitation.status,
      expiresAt: prismaInvitation.expiresAt,
      createdAt: prismaInvitation.createdAt,
      createdById: prismaInvitation.createdById,
      apartmentId: prismaInvitation.apartmentId,
      buildingId: prismaInvitation.buildingId,
    })
  }

  static toPrismaCreate(invitation: Invitation): {
    email: string
    role: UserRole
    token: string
    status: InvitationStatus
    expiresAt: Date
    createdById: string
    apartmentId?: string
    buildingId?: string
  } {
    return {
      email: invitation.email,
      role: invitation.role,
      token: invitation.token,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      createdById: invitation.createdById,
      apartmentId: invitation.apartmentId,
      buildingId: invitation.buildingId,
    }
  }

  static toPrismaUpdate(invitation: Invitation): {
    status?: InvitationStatus
    expiresAt?: Date
  } {
    return {
      status: invitation.status,
      expiresAt: invitation.expiresAt,
    }
  }
}
