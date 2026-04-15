import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum.js'
import type { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import type { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import type { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

export interface InvitationProps {
  id: string
  email: Email
  role: UserRole
  token: string
  status?: InvitationStatus
  expiresAt: Date
  createdById: UserId
  apartmentId?: string
  buildingId?: string
  createdAt: Date
}

export class Invitation {
  private readonly _id: string
  private readonly _email: Email
  private readonly _role: UserRole
  private readonly _token: string
  private _status: InvitationStatus
  private readonly _expiresAt: Date
  private readonly _createdById: UserId
  private readonly _apartmentId?: string
  private readonly _buildingId?: string
  private readonly _createdAt: Date

  private constructor(props: InvitationProps) {
    this._id = props.id
    this._email = props.email
    this._role = props.role
    this._token = props.token
    this._status = props.status ?? InvitationStatus.PENDING
    this._expiresAt = props.expiresAt
    this._createdById = props.createdById
    this._apartmentId = props.apartmentId
    this._buildingId = props.buildingId
    this._createdAt = props.createdAt
  }

  get id(): string {
    return this._id
  }

  get email(): Email {
    return this._email
  }

  get role(): UserRole {
    return this._role
  }

  get token(): string {
    return this._token
  }

  get status(): InvitationStatus {
    return this._status
  }

  get expiresAt(): Date {
    return this._expiresAt
  }

  get createdById(): UserId {
    return this._createdById
  }

  get apartmentId(): string | undefined {
    return this._apartmentId
  }

  get buildingId(): string | undefined {
    return this._buildingId
  }

  get createdAt(): Date {
    return this._createdAt
  }

  static create(props: InvitationProps): Invitation {
    return new Invitation(props)
  }

  accept(): void {
    if (this._status !== InvitationStatus.PENDING) {
      throw new Error('Invitation cannot be accepted')
    }
    if (this.isExpired()) {
      throw new Error('Invitation has expired')
    }
    this._status = InvitationStatus.ACCEPTED
  }

  cancel(): void {
    if (this._status !== InvitationStatus.PENDING) {
      throw new Error('Invitation cannot be cancelled')
    }
    this._status = InvitationStatus.CANCELLED
  }

  isExpired(): boolean {
    return new Date() > this._expiresAt
  }
}
