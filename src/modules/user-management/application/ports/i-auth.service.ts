import type { Observable } from 'rxjs'
import type { User } from '../../domain/entities/user.entity'
import type { Email } from '../../domain/value-objects/email.value-object'
import type { Password } from '../../domain/value-objects/password.value-object'

export const AUTH_SERVICE_PORT = "AUTH_SERVICE_PORT" as const

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface IAuthServicePort {
  validateCredentials(email: Email, password: Password): Observable<User | null>
  generateTokens(user: User): Observable<AuthTokens>
  refreshToken(refreshToken: string): Observable<AuthTokens>
  logout(refreshToken: string): Observable<void>
  hashPassword(password: Password): string
  comparePassword(password: Password, hash: string): boolean
}
