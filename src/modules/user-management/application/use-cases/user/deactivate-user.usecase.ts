import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { IUserServicePort } from '@/modules/user-management/application/ports/i-user.service'
import type { User } from '@/modules/user-management/domain/entities/user.entity'

@Injectable()
export class DeactivateUserUseCase {
  constructor(private readonly userService: IUserServicePort) {}

  execute(id: string): Observable<User> {
    return this.userService.deactivate(id)
  }
}
