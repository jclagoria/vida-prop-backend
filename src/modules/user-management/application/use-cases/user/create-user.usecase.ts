import { Injectable, Logger } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type { User } from '@/modules/user-management/domain/entities/user.entity'
import type { UserDomainService } from '@/modules/user-management/domain/services/user.domain-service'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { Password } from '@/modules/user-management/domain/value-objects/password.value-object'
import type { CreateUserDto } from '../../dto/create-user.dto'
import type { IUserServicePort } from '../../ports/i-user.service'

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name)

  constructor(
    private readonly userService: IUserServicePort,
    private readonly domainService: UserDomainService
  ) {}

  execute(dto: CreateUserDto): Observable<User> {
    return new Observable((subscriber) => {
      try {
        const emailVO = new Email(dto.email)
        const passwordVO = new Password(dto.password)

        const validation = this.domainService.validateUserCreation({
          email: emailVO,
          password: passwordVO,
          role: dto.role,
        })

        if (!validation.valid) {
          subscriber.error(new Error(validation.errors.join(', ')))
          return
        }

        subscriber.next({} as User)
      } catch (error) {
        subscriber.error(error)
      }
    }).pipe(
      switchMap(() => this.userService.create(dto)),
      catchError((error) => {
        this.logger.error(
          'CreateUserUseCase.execute failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'CreateUserUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        return throwError(() => error)
      })
    )
  }
}
