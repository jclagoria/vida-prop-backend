import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { User } from '@/modules/user-management/domain/entities/user.entity'
import type { UpdateUserDto } from '../../dto/update-user.dto'
import type { IUserServicePort } from '../../ports/i-user.service'

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userService: IUserServicePort) {}

  execute(id: string, dto: UpdateUserDto): Observable<User> {
    return this.userService.update(id, dto)
  }
}
