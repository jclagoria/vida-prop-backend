import { InvitationStatus } from '../enums/invitation-status.enum'
import type { UserRole } from '../enums/user-role.enum'

export interface InvitationProps {
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

export class Invitation {
  private readonly props: InvitationProps

  constructor(props: InvitationProps) {
    this.props = props
  }

  get id(): string {
    return this.props.id
  }

  get email(): string {
    return this.props.email
  }

  get role(): UserRole {
    return this.props.role
  }

  get token(): string {
    return this.props.token
  }

  get status(): InvitationStatus {
    return this.props.status
  }

  get expiresAt(): Date {
    return this.props.expiresAt
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get createdById(): string {
    return this.props.createdById
  }

  get apartmentId(): string | undefined {
    return this.props.apartmentId
  }

  get buildingId(): string | undefined {
    return this.props.buildingId
  }

  isPending(): boolean {
    return this.props.status === InvitationStatus.PENDING
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt
  }

  canBeAccepted(): boolean {
    return this.isPending() && !this.isExpired()
  }

  accept(): Invitation {
    if (!this.canBeAccepted()) {
      throw new Error('Invitation cannot be accepted')
    }
    return new Invitation({
      ...this.props,
      status: InvitationStatus.ACCEPTED,
    })
  }

  expire(): Invitation {
    return new Invitation({
      ...this.props,
      status: InvitationStatus.EXPIRED,
    })
  }

  cancel(): Invitation {
    return new Invitation({
      ...this.props,
      status: InvitationStatus.CANCELLED,
    })
  }

  equals(other: Invitation): boolean {
    if (!(other instanceof Invitation)) {
      return false
    }
    return this.props.id === other.props.id
  }
}
