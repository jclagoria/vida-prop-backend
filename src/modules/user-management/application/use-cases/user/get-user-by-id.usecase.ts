import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { User } from '@/modules/user-management/domain/entities/user.entity'
import type { IUserServicePort } from '../../ports/i-user.service'

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userService: IUserServicePort) {}

  execute(id: string): Observable<User | null> {
    return this.userService.findById(id)
  }
}
