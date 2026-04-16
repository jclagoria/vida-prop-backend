import { Injectable } from '@nestjs/common'
import { defer, EMPTY, from, type Observable } from 'rxjs'
import { map, shareReplay, switchMap } from 'rxjs/operators'
import type { User } from '../../domain/entities/user.entity'
import type { IUserRepository } from '../../domain/interfaces/i-user.repository'
import type { Email } from '../../domain/value-objects/email.value-object'
import type { UserId } from '../../domain/value-objects/user-id.value-object'
import { UserMapper } from './mappers/user.mapper'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  private prisma: any

  constructor(prisma: any) {
    this.prisma = prisma
  }

  findById(id: UserId): Observable<User | null> {
    return defer(() => from(this.prisma.user.findUnique({ where: { id: id.toString() } }))).pipe(
      map((prismaUser: any) => (prismaUser ? UserMapper.toDomain(prismaUser) : null)),
      shareReplay(1)
    )
  }

  findByEmail(email: Email): Observable<User | null> {
    return defer(() =>
      from(this.prisma.user.findUnique({ where: { email: email.getValue() } }))
    ).pipe(
      map((prismaUser: any) => (prismaUser ? UserMapper.toDomain(prismaUser) : null)),
      shareReplay(1)
    )
  }

  findAll(): Observable<User[]> {
    return defer(() => from(this.prisma.user.findMany() as Promise<any[]>)).pipe(
      map((users: any[]) => users.map((u: any) => UserMapper.toDomain(u)))
    ) as Observable<User[]>
  }

  save(user: User): Observable<User> {
    return defer(() =>
      from(
        this.prisma.user.create({
          data: UserMapper.toPrismaCreate(user),
        })
      )
    ).pipe(map((prismaUser: any) => UserMapper.toDomain(prismaUser)))
  }

  update(user: User): Observable<User> {
    return defer(() =>
      from(
        this.prisma.user.update({
          where: { id: user.id.toString() },
          data: UserMapper.toPrismaUpdate(user),
        })
      )
    ).pipe(map((prismaUser: any) => UserMapper.toDomain(prismaUser)))
  }

  delete(id: UserId): Observable<void> {
    return defer(() => from(this.prisma.user.delete({ where: { id: id.toString() } }))).pipe(
      map(() => void 0)
    )
  }
}
