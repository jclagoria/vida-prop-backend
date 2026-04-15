import type { Observable } from 'rxjs'
import type { User } from '@/modules/user-management/domain/entities/user.entity.js'
import type { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import type { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

export interface IUserServicePort {
  createUser(email: string, password: string, role: UserRole): Observable<User>
  updateUser(
    id: UserId,
    updates: { email?: string; role?: UserRole; isActive?: boolean }
  ): Observable<User>
  deactivateUser(id: UserId): Observable<User>
  reactivateUser(id: UserId): Observable<User>
  getUserById(id: UserId): Observable<User | null>
  getUserByEmail(email: string): Observable<User | null>
}
