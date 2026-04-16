import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { from, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import {
  AUTH_SERVICE_PORT,
  type AuthTokens,
  type IAuthServicePort,
} from '@/modules/user-management/application/ports/i-auth.service'
import type { User } from '@/modules/user-management/domain/entities/user.entity'
import type { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import type { Password } from '@/modules/user-management/domain/value-objects/password.value-object'
import type { BcryptAdapter } from '@/modules/user-management/infrastructure/adapters/bcrypt.adapter'
import type { JwtAdapter } from '@/modules/user-management/infrastructure/adapters/jwt.adapter'
import type { PrismaUserRepository } from '@/modules/user-management/infrastructure/repositories/prisma-user.repository'

@Injectable()
export class AuthService implements IAuthServicePort {
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly userRepository: PrismaUserRepository
  ) {}

  validateCredentials(email: Email, password: Password): Observable<User | null> {
    return this.userRepository.findByEmail(email).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null)
        }
        const isValid = this.bcryptAdapter.compare(password.getValue(), user.passwordHash)
        return of(isValid ? user : null)
      })
    )
  }

  generateTokens(user: User): Observable<AuthTokens> {
    const tokens = this.jwtAdapter.generateTokens(user)
    return of(tokens)
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    try {
      const tokens = this.jwtAdapter.refreshToken(refreshToken)
      return of(tokens)
    } catch (error) {
      return from(Promise.reject(error))
    }
  }

  logout(_refreshToken: string): Observable<void> {
    return of(undefined)
  }

  hashPassword(password: Password): string {
    return this.bcryptAdapter.hash(password.getValue())
  }

  comparePassword(password: Password, hash: string): boolean {
    return this.bcryptAdapter.compare(password.getValue(), hash)
  }
}
