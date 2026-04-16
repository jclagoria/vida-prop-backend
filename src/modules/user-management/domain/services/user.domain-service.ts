import { User } from '../entities/user.entity'
import { UserRole } from '../enums/user-role.enum'
import { Email } from '../value-objects/email.value-object'
import type { Password } from '../value-objects/password.value-object'
import { UserId } from '../value-objects/user-id.value-object'

export interface CreateUserInput {
  email: Email
  password: Password
  role: UserRole
}

export class UserDomainService {
  createUser(input: CreateUserInput): User {
    const passwordVO = input.password
    if (!passwordVO.meetsPolicy()) {
      const errors = passwordVO.getPolicyErrors()
      throw new Error(errors.join(', '))
    }

    const now = new Date()
    return new User({
      id: new UserId(crypto.randomUUID()),
      email: input.email,
      passwordHash: '', // To be filled by infrastructure
      role: input.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
  }

  validateUserCreation(input: CreateUserInput): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    try {
      new Email(input.email.getValue())
    } catch {
      errors.push('Invalid email format')
    }

    const passwordVO = input.password
    if (!passwordVO.meetsPolicy()) {
      errors.push(...passwordVO.getPolicyErrors())
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  canManageUser(actor: User, target: User): boolean {
    if (actor.isAdmin()) {
      return true
    }
    return actor.id.equals(target.id)
  }

  canInviteUser(inviter: User, roleToInvite: UserRole): boolean {
    if (inviter.isAdmin()) {
      return true
    }

    if (inviter.role === UserRole.OWNER && roleToInvite === UserRole.TENANT) {
      return true
    }

    return false
  }
}
