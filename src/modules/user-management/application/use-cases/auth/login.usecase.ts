import { Inject, Injectable } from '@nestjs/common'
import { EMPTY, from, type Observable } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import {
  AUTH_SERVICE_PORT,
  type AuthTokens,
  type IAuthServicePort,
} from '@/modules/user-management/application/ports/i-auth.service'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { Password } from '@/modules/user-management/domain/value-objects/password.value-object'

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: IAuthServicePort
  ) {}

  execute(email: string, password: string): Observable<AuthTokens> {
    return from(this.validateInput(email, password)).pipe(
      switchMap(([emailVO, passwordVO]) =>
        this.authService.validateCredentials(emailVO, passwordVO)
      ),
      switchMap((user) => {
        if (!user) {
          throw new Error('Invalid credentials')
        }
        return this.authService.generateTokens(user)
      }),
      catchError((error) => {
        throw new Error(`Login failed: ${error.message}`)
      })
    )
  }

  private async validateInput(email: string, password: string): Promise<[Email, Password]> {
    const emailVO = new Email(email)
    const passwordVO = new Password(password)
    return [emailVO, passwordVO]
  }
}
