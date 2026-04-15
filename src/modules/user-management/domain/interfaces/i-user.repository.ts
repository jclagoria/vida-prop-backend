import type { Observable } from 'rxjs'
import type { User } from '@/modules/user-management/domain/entities/user.entity.js'
import type { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import type { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

export interface IUserRepository {
  findById(id: UserId): Observable<User | null>
  findByEmail(email: Email): Observable<User | null>
  save(user: User): Observable<User>
  update(user: User): Observable<User>
  delete(id: UserId): Observable<void>
  findAll(): Observable<User[]>
}
