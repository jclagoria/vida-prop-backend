import type { Observable } from 'rxjs'
import type { User } from '../entities/user.entity'
import type { Email } from '../value-objects/email.value-object'
import type { Password } from '../value-objects/password.value-object'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface IAuthService {
  validateCredentials(email: Email, password: Password): Observable<User | null>
  generateTokens(user: User): Observable<AuthTokens>
  refreshToken(refreshToken: string): Observable<AuthTokens>
  hashPassword(password: Password): string
  comparePassword(password: Password, hash: string): boolean
}
