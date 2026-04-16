import { type ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { type Observable, of } from 'rxjs'
import { catchError, first, map } from 'rxjs/operators'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return of(super.canActivate(context)).pipe(
      first(),
      map((result) => result === true),
      catchError(() => of(false))
    )
  }

  handleRequest<TUser = any>(err: Error | null, user: TUser, info: Error): TUser {
    if (err || !user) {
      throw err || info || new Error('Unauthorized')
    }
    return user
  }
}
