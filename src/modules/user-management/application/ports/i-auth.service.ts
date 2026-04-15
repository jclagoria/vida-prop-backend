import type { Observable } from 'rxjs'
import type { User } from '@/modules/user-management/domain/entities/user.entity.js'
import type { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import type { Password } from '@/modules/user-management/domain/value-objects/password.value-object.js'

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface IAuthServicePort {
  validateCredentials(email: Email, password: Password): Observable<User | null>
  generateTokens(user: User): Observable<{ accessToken: string; refreshToken: string }>
  refreshToken(refreshToken: string): Observable<{ accessToken: string; refreshToken: string }>
  logout(refreshToken: string): Observable<void>
  hashPassword(password: Password): string
  comparePassword(password: Password, hash: string): boolean
}
