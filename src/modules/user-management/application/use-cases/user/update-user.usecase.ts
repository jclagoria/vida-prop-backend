import { Injectable, Logger } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import type { User } from '@/modules/user-management/domain/entities/user.entity'
import type { UpdateUserDto } from '../../dto/update-user.dto'
import type { IUserServicePort } from '../../ports/i-user.service'

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name)

  constructor(private readonly userService: IUserServicePort) {}

  execute(id: string, dto: UpdateUserDto): Observable<User> {
    return this.userService.update(id, dto).pipe(
      tap((user) => {
        this.logger.log('User updated', {
          useCase: 'UpdateUserUseCase',
          operation: 'execute',
          userId: id,
        })
      }),
      catchError((error) => {
        this.logger.error('User update failed', error instanceof Error ? error.stack : undefined, {
          useCase: 'UpdateUserUseCase',
          operation: 'execute',
          userId: id,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        throw error
      })
    )
  }
}
