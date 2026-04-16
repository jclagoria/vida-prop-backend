import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type {
  AuthTokens,
  IAuthServicePort,
} from '@/modules/user-management/application/ports/i-auth.service'

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly authService: IAuthServicePort) {}

  execute(refreshToken: string): Observable<AuthTokens> {
    return this.authService.refreshToken(refreshToken)
  }
}
