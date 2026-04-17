import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type * as winston from 'winston'
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

export const DOMAIN_LOGGER = 'DomainLogger'

@Injectable()
export class UserDomainService {
  constructor(
    @Inject(DOMAIN_LOGGER)
    private readonly logger: winston.Logger
  ) {}

  createUser(input: CreateUserInput): User {
    this.logger.info('UserDomainService.createUser started', {
      service: 'UserDomainService',
      operation: 'createUser',
      email: input.email.getValue(),
      role: input.role,
    })

    try {
      const passwordVO = input.password
      if (!passwordVO.meetsPolicy()) {
        const errors = passwordVO.getPolicyErrors()
        this.logger.error('Password policy violation', errors.join(', '), {
          service: 'UserDomainService',
          operation: 'createUser',
          email: input.email.getValue(),
          errors,
        })
        throw new Error(errors.join(', '))
      }

      const now = new Date()
      const user = new User({
        id: new UserId(crypto.randomUUID()),
        email: input.email,
        passwordHash: '',
        role: input.role,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })

      this.logger.info('UserDomainService.createUser success', {
        service: 'UserDomainService',
        operation: 'createUser',
        userId: user.id.toString(),
      })

      return user
    } catch (error) {
      this.logger.error(
        'UserDomainService.createUser failed',
        error instanceof Error ? error.stack : undefined,
        {
          service: 'UserDomainService',
          operation: 'createUser',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      )
      throw error
    }
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

    if (errors.length > 0) {
      this.logger.warn('User validation failed', {
        service: 'UserDomainService',
        operation: 'validateUserCreation',
        errors,
      })
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
