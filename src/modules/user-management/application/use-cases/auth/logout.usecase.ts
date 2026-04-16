import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { IAuthServicePort } from '@/modules/user-management/application/ports/i-auth.service'

@Injectable()
export class LogoutUseCase {
  constructor(private readonly authService: IAuthServicePort) {}

  execute(refreshToken: string): Observable<void> {
    return this.authService.logout(refreshToken)
  }
}
