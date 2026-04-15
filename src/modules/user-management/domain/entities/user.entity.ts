import type { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import type { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import type { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

export interface UserProps {
  id: UserId
  email: Email
  passwordHash: string
  role: UserRole
  isActive?: boolean
  createdAt: Date
  updatedAt: Date
}

export class User {
  private readonly _id: UserId
  private readonly _email: Email
  private readonly _passwordHash: string
  private _role: UserRole
  private _isActive: boolean
  private readonly _createdAt: Date
  private _updatedAt: Date

  private constructor(props: UserProps) {
    this._id = props.id
    this._email = props.email
    this._passwordHash = props.passwordHash
    this._role = props.role
    this._isActive = props.isActive ?? true
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  get id(): UserId {
    return this._id
  }

  get email(): Email {
    return this._email
  }

  get passwordHash(): string {
    return this._passwordHash
  }

  get role(): UserRole {
    return this._role
  }

  get isActive(): boolean {
    return this._isActive
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  static create(props: UserProps): User {
    return new User(props)
  }

  deactivate(): void {
    if (!this._isActive) {
      throw new Error('User already deactivated')
    }
    this._isActive = false
    this._updatedAt = new Date()
  }

  reactivate(): void {
    if (this._isActive) {
      throw new Error('User is already active')
    }
    this._isActive = true
    this._updatedAt = new Date()
  }

  changeRole(role: UserRole): void {
    this._role = role
    this._updatedAt = new Date()
  }

  equals(other: User): boolean {
    return this._id.equals(other._id)
  }
}
