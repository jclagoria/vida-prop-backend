import { type Observable, of, throwError } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import type { LoginDto } from '@/modules/user-management/application/dto/login.dto.js'
import type { IAuthServicePort } from '@/modules/user-management/application/ports/i-auth.service.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { Password } from '@/modules/user-management/domain/value-objects/password.value-object.js'

export interface LoginResult {
  userId: string
  email: string
  role: string
  accessToken: string
  refreshToken: string
}

export class LoginUseCase {
  constructor(private readonly authService: IAuthServicePort) {}

  execute(dto: LoginDto): Observable<LoginResult> {
    if (!dto.email || !dto.password) {
      return throwError(() => new Error('Email and password are required'))
    }

    let email: Email
    let password: Password

    try {
      email = Email.create(dto.email)
      password = Password.create(dto.password)
    } catch (err) {
      return throwError(() => err as Error)
    }

    return this.authService.validateCredentials(email, password).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('Invalid credentials'))
        }
        return this.authService.generateTokens(user).pipe(
          map((tokens) => ({
            userId: user.id.value,
            email: user.email.value,
            role: user.role,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          }))
        )
      }),
      catchError((err) => throwError(() => err))
    )
  }
}
