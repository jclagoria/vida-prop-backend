import { type Observable, throwError } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import type { CreateUserDto } from '../../dto/create-user.dto.js'
import type { IUserServicePort } from '../../ports/i-user.service.js'

export class CreateUserUseCase {
  constructor(private readonly userService: IUserServicePort) {}

  execute(dto: CreateUserDto): Observable<{ userId: string; email: string; role: string }> {
    if (!dto.email || !dto.password || !dto.role) {
      return throwError(() => new Error('Email, password, and role are required'))
    }

    const role = dto.role.toUpperCase() as UserRole
    if (!Object.values(UserRole).includes(role)) {
      return throwError(() => new Error('Invalid role'))
    }

    return this.userService.createUser(dto.email, dto.password, role).pipe(
      map((user) => ({
        userId: user.id.value,
        email: user.email.value,
        role: user.role,
      })),
      catchError((err) => throwError(() => err))
    )
  }
}
