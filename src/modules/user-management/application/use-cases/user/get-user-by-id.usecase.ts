import { Injectable, Logger } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import type { User } from '@/modules/user-management/domain/entities/user.entity'
import type { IUserServicePort } from '../../ports/i-user.service'

@Injectable()
export class GetUserByIdUseCase {
  private readonly logger = new Logger(GetUserByIdUseCase.name)

  constructor(private readonly userService: IUserServicePort) {}

  execute(id: string): Observable<User | null> {
    return this.userService.findById(id).pipe(
      tap((user) => {
        if (!user) {
          this.logger.warn('User not found', {
            useCase: 'GetUserByIdUseCase',
            operation: 'execute',
            userId: id,
          })
        }
      })
    )
  }
}
