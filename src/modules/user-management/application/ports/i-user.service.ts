import type { Observable } from 'rxjs'
import type { User } from '../../domain/entities/user.entity'
import type { CreateUserDto } from '../dto/create-user.dto'
import type { UpdateUserDto } from '../dto/update-user.dto'

export interface IUserServicePort {
  create(dto: CreateUserDto): Observable<User>
  update(id: string, dto: UpdateUserDto): Observable<User>
  deactivate(id: string): Observable<User>
  findById(id: string): Observable<User | null>
  findAll(): Observable<User[]>
}
