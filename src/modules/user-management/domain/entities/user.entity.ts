import { UserRole } from '../enums/user-role.enum'
import type { Email } from '../value-objects/email.value-object'
import type { UserId } from '../value-objects/user-id.value-object'

export interface UserProps {
  id: UserId
  email: Email
  passwordHash: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export class User {
  private readonly props: UserProps

  constructor(props: UserProps) {
    this.props = props
  }

  get id(): UserId {
    return this.props.id
  }

  get email(): Email {
    return this.props.email
  }

  get passwordHash(): string {
    return this.props.passwordHash
  }

  get role(): UserRole {
    return this.props.role
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN
  }

  isActiveUser(): boolean {
    return this.props.isActive
  }

  deactivate(): User {
    return new User({
      ...this.props,
      isActive: false,
      updatedAt: new Date(),
    })
  }

  activate(): User {
    return new User({
      ...this.props,
      isActive: true,
      updatedAt: new Date(),
    })
  }

  equals(other: User): boolean {
    if (!(other instanceof User)) {
      return false
    }
    return this.props.id.equals(other.props.id)
  }
}
