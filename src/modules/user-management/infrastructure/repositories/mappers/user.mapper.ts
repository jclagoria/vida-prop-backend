import { User } from '../../domain/entities/user.entity'
import type { UserRole } from '../../domain/enums/user-role.enum'
import { Email } from '../../domain/value-objects/email.value-object'
import { UserId } from '../../domain/value-objects/user-id.value-object'

interface PrismaUser {
  id: string
  email: string
  passwordHash: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User({
      id: new UserId(prismaUser.id),
      email: new Email(prismaUser.email),
      passwordHash: prismaUser.passwordHash,
      role: prismaUser.role,
      isActive: prismaUser.isActive,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    })
  }

  static toPrismaCreate(user: User): {
    email: string
    passwordHash: string
    role: UserRole
    isActive: boolean
  } {
    return {
      email: user.email.getValue(),
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
    }
  }

  static toPrismaUpdate(user: User): {
    email?: string
    passwordHash?: string
    role?: UserRole
    isActive?: boolean
  } {
    return {
      email: user.email.getValue(),
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
    }
  }
}
