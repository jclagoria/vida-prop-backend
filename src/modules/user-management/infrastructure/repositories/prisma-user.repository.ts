import { Inject, Injectable } from '@nestjs/common'
import { defer, type Observable, of } from 'rxjs'
import { catchError, map, shareReplay } from 'rxjs/operators'
import { User } from '@/modules/user-management/domain/entities/user.entity.js'
import type { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import type { IUserRepository } from '@/modules/user-management/domain/interfaces/i-user.repository.js'
import type { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { Email as EmailVO } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import type { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'
import { UserId as UserIdVO } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'
import type { PrismaClient } from '@/types/prisma.js'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  private readonly cache = new Map<string, User>()

  constructor(private readonly prisma: PrismaClient) {}

  findById(id: UserId): Observable<User | null> {
    return defer(() =>
      this.prisma.users.findUnique({
        where: { id: id.value },
      })
    ).pipe(
      map((prismaUser) => (prismaUser ? this.mapToDomain(prismaUser) : null)),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  findByEmail(email: Email): Observable<User | null> {
    const cacheKey = `email:${email.value}`
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return of(cached)
    }

    return defer(() =>
      this.prisma.users.findUnique({
        where: { email: email.value },
      })
    ).pipe(
      map((prismaUser) => {
        const user = prismaUser ? this.mapToDomain(prismaUser) : null
        if (user) {
          this.cache.set(cacheKey, user)
        }
        return user
      }),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  save(user: User): Observable<User> {
    return defer(() =>
      this.prisma.users.create({
        data: {
          id: user.id.value,
          email: user.email.value,
          passwordHash: user.passwordHash,
          role: user.role as UserRole,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    ).pipe(
      map((prismaUser) => {
        const saved = this.mapToDomain(prismaUser)
        this.cache.set(`email:${saved.email.value}`, saved)
        return saved
      }),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  update(user: User): Observable<User> {
    return defer(() =>
      this.prisma.users.update({
        where: { id: user.id.value },
        data: {
          email: user.email.value,
          passwordHash: user.passwordHash,
          role: user.role as UserRole,
          isActive: user.isActive,
          updatedAt: user.updatedAt,
        },
      })
    ).pipe(
      map((prismaUser) => {
        const updated = this.mapToDomain(prismaUser)
        this.cache.set(`email:${updated.email.value}`, updated)
        return updated
      }),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  delete(id: UserId): Observable<void> {
    return defer(() =>
      this.prisma.users.delete({
        where: { id: id.value },
      })
    ).pipe(
      map(() => {
        this.cache.forEach((_, key) => {
          if (key.startsWith('email:')) {
            this.cache.delete(key)
          }
        })
      }),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  findAll(): Observable<User[]> {
    return defer(() => this.prisma.users.findMany()).pipe(
      map((prismaUsers) => prismaUsers.map((u) => this.mapToDomain(u))),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  private mapToDomain(prismaUser: {
    id: string
    email: string
    passwordHash: string
    role: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }): User {
    return User.create({
      id: UserIdVO.create(prismaUser.id),
      email: EmailVO.create(prismaUser.email),
      passwordHash: prismaUser.passwordHash,
      role: prismaUser.role as UserRole,
      isActive: prismaUser.isActive,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    })
  }
}
