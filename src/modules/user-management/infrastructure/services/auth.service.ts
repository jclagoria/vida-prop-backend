import { Injectable, Logger } from '@nestjs/common'
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
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly userRepository: PrismaUserRepository
  ) {}

  validateCredentials(email: Email, password: Password): Observable<User | null> {
    this.logger.debug(`Validating credentials for ${email.getValue()}`, {
      service: 'AuthService',
      operation: 'validateCredentials',
    })

    return this.userRepository.findByEmail(email).pipe(
      switchMap((user) => {
        if (!user) {
          this.logger.warn('Authentication failed - user not found', {
            service: 'AuthService',
            operation: 'validateCredentials',
            email: email.getValue(),
          })
          return of(null)
        }
        const isValid = this.bcryptAdapter.compare(password.getValue(), user.passwordHash)
        if (!isValid) {
          this.logger.warn('Authentication failed - invalid password', {
            service: 'AuthService',
            operation: 'validateCredentials',
            email: email.getValue(),
          })
        }
        return of(isValid ? user : null)
      })
    )
  }

  generateTokens(user: User): Observable<AuthTokens> {
    this.logger.debug('Generating tokens', {
      service: 'AuthService',
      operation: 'generateTokens',
      userId: user.id.toString(),
    })
    const tokens = this.jwtAdapter.generateTokens(user)
    return of(tokens)
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    this.logger.debug('Refreshing token', {
      service: 'AuthService',
      operation: 'refreshToken',
    })

    try {
      const tokens = this.jwtAdapter.refreshToken(refreshToken)
      return of(tokens)
    } catch (error) {
      this.logger.error('Token refresh failed', error instanceof Error ? error.stack : undefined, {
        service: 'AuthService',
        operation: 'refreshToken',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return from(Promise.reject(error))
    }
  }

  logout(_refreshToken: string): Observable<void> {
    this.logger.debug('User logout', {
      service: 'AuthService',
      operation: 'logout',
    })
    return of(undefined)
  }

  hashPassword(password: Password): string {
    return this.bcryptAdapter.hash(password.getValue())
  }

  comparePassword(password: Password, hash: string): boolean {
    return this.bcryptAdapter.compare(password.getValue(), hash)
  }
}
