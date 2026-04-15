import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'
import { from, type Observable } from 'rxjs'
import { catchError, map, shareReplay } from 'rxjs/operators'

@Injectable()
export class BcryptAdapter {
  private readonly rounds = 10

  hash(password: string): Observable<string> {
    return from(hash(password, this.rounds)).pipe(
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  compare(password: string, hash: string): Observable<boolean> {
    return from(compare(password, hash)).pipe(
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }
}
