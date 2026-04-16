import type { Observable } from 'rxjs'
import type { User } from '../entities/user.entity'
import type { Email } from '../value-objects/email.value-object'
import type { UserId } from '../value-objects/user-id.value-object'

export interface IUserRepository {
  findById(id: UserId): Observable<User | null>
  findByEmail(email: Email): Observable<User | null>
  findAll(): Observable<User[]>
  save(user: User): Observable<User>
  update(user: User): Observable<User>
  delete(id: UserId): Observable<void>
}
