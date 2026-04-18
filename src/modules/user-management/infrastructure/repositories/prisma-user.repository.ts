import { Injectable } from '@nestjs/common'
import { defer, from, type Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { PrismaBaseRepository } from '@/common/repositories/prisma-base.repository'
import type { User } from '@/modules/user-management/domain/entities/user.entity'
import type { IUserRepository } from '@/modules/user-management/domain/interfaces/i-user.repository'
import type { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import type { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'
import { UserMapper } from './mappers/user.mapper'

@Injectable()
export class PrismaUserRepository
  extends PrismaBaseRepository<User, any, any, any, UserId>
  implements IUserRepository
{
  constructor(prisma: any) {
    super(prisma, 'User')
  }

  protected getModel(): string {
    return 'user'
  }

  protected toDomain(prismaEntity: any): User {
    return UserMapper.toDomain(prismaEntity)
  }

  protected toPrismaCreate(entity: User): any {
    return UserMapper.toPrismaCreate(entity)
  }

  protected toPrismaUpdate(entity: User): any {
    return UserMapper.toPrismaUpdate(entity)
  }

  protected getId(entity: User): UserId {
    return entity.id
  }

  findByEmail(email: Email): Observable<User | null> {
    return defer(() =>
      from(this.prisma.user.findUnique({ where: { email: email.getValue() } }))
    ).pipe(
      map((prismaUser: any) => (prismaUser ? UserMapper.toDomain(prismaUser) : null)),
      shareReplay(1)
    )
  }

  update(user: User): Observable<User> {
    return defer(() =>
      from(
        this.prisma.$transaction(async (tx: any) => {
          return tx.user.update({
            where: { id: user.id.toString() },
            data: UserMapper.toPrismaUpdate(user),
          })
        })
      )
    ).pipe(map((prismaUser: any) => UserMapper.toDomain(prismaUser)))
  }
}
