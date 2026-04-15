import type { Observable } from 'rxjs'
import type { User } from '../../entities/user.entity'
import type { Email } from '../../value-objects/email.value-object'
import type { Password } from '../../value-objects/password.value-object'

export interface AuthResult {
  user: User
  accessToken: string
  refreshToken: string
}

export interface IAuthService {
  validateCredentials(email: Email, password: Password): Observable<User | null>
  generateTokens(user: User): Observable<{ accessToken: string; refreshToken: string }>
  refreshToken(refreshToken: string): Observable<{ accessToken: string; refreshToken: string }>
  validateAccessToken(token: string): Observable<User | null>
  hashPassword(password: Password): string
  comparePassword(password: Password, hash: string): boolean
}
