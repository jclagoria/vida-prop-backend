import { type Observable, of, throwError } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { User } from '@/modules/user-management/domain/entities/user.entity.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import type { IUserRepository } from '@/modules/user-management/domain/interfaces/i-user.repository.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { Password } from '@/modules/user-management/domain/value-objects/password.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

export interface CreateUserParams {
  email: string
  password: string
  role: UserRole
}

export class UserDomainService {
  constructor(private readonly userRepository: IUserRepository) {}

  createUser(params: CreateUserParams): Observable<User> {
    let email: Email
    let password: Password

    try {
      email = Email.create(params.email)
      password = Password.create(params.password)
    } catch (err) {
      return throwError(() => err as Error)
    }

    return this.userRepository.findByEmail(email).pipe(
      switchMap((existingUser) => {
        if (existingUser) {
          return throwError(() => new Error('Email already exists'))
        }
        const user = User.create({
          id: UserId.generate(),
          email,
          passwordHash: password.value,
          role: params.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        return this.userRepository.save(user)
      })
    )
  }

  deactivateUser(id: UserId): Observable<User> {
    return this.userRepository.findById(id).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('User not found'))
        }
        user.deactivate()
        return this.userRepository.update(user)
      })
    )
  }

  reactivateUser(id: UserId): Observable<User> {
    return this.userRepository.findById(id).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('User not found'))
        }
        user.reactivate()
        return this.userRepository.update(user)
      })
    )
  }

  changeUserRole(id: UserId, role: UserRole): Observable<User> {
    return this.userRepository.findById(id).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('User not found'))
        }
        user.changeRole(role)
        return this.userRepository.update(user)
      })
    )
  }

  canInvite(inviter: User, invitedRole: UserRole): boolean {
    switch (inviter.role) {
      case UserRole.ADMIN:
        return true
      case UserRole.OWNER:
        return invitedRole === UserRole.TENANT
      default:
        return false
    }
  }
}
