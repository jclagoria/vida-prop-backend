import { Injectable } from '@nestjs/common'
import { defer, from, map, type Observable, shareReplay, switchMap } from 'rxjs'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum'
import type {
  IInvitationRepository,
  PaginatedResult,
} from '@/modules/user-management/domain/interfaces/i-invitation.repository'
import { InvitationMapper } from '@/modules/user-management/infrastructure/repositories/mappers/invitation.mapper'

@Injectable()
export class PrismaInvitationRepository implements IInvitationRepository {
  private prisma: any

  constructor(prisma: any) {
    this.prisma = prisma
  }

  findById(id: string): Observable<Invitation | null> {
    return defer(() => from(this.prisma.invitation.findUnique({ where: { id } }))).pipe(
      map((prismaInvitation: any) =>
        prismaInvitation ? InvitationMapper.toDomain(prismaInvitation) : null
      ),
      shareReplay(1)
    )
  }

  findByToken(token: string): Observable<Invitation | null> {
    return defer(() => from(this.prisma.invitation.findUnique({ where: { token } }))).pipe(
      map((prismaInvitation: any) =>
        prismaInvitation ? InvitationMapper.toDomain(prismaInvitation) : null
      ),
      shareReplay(1)
    )
  }

  findByEmail(email: string): Observable<Invitation | null> {
    return defer(() =>
      from(
        this.prisma.invitation.findFirst({
          where: { email, status: 'PENDING' },
        })
      )
    ).pipe(
      map((prismaInvitation: any) =>
        prismaInvitation ? InvitationMapper.toDomain(prismaInvitation) : null
      ),
      shareReplay(1)
    )
  }

  save(invitation: Invitation): Observable<Invitation> {
    return defer(() =>
      from(
        this.prisma.invitation.create({
          data: InvitationMapper.toPrismaCreate(invitation),
        })
      )
    ).pipe(map((prismaInvitation: any) => InvitationMapper.toDomain(prismaInvitation)))
  }

  update(invitation: Invitation): Observable<Invitation> {
    return defer(() =>
      from(
        this.prisma.invitation.update({
          where: { id: invitation.id },
          data: InvitationMapper.toPrismaUpdate(invitation),
        })
      )
    ).pipe(map((prismaInvitation: any) => InvitationMapper.toDomain(prismaInvitation)))
  }

  delete(id: string): Observable<void> {
    return defer(() => from(this.prisma.invitation.delete({ where: { id } }))).pipe(
      map(() => void 0)
    )
  }

  findMany(options: {
    page: number
    limit: number
    status?: string
  }): Observable<PaginatedResult<Invitation>> {
    const { page, limit, status } = options
    const skip = (page - 1) * limit
    const whereClause = status ? { status: status as InvitationStatus } : undefined

    return defer(() =>
      from(
        this.prisma.invitation.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }) as Promise<any[]>
      )
    ).pipe(
      switchMap((prismaInvitations: any[]) =>
        defer(() =>
          from(
            this.prisma.invitation.count({
              where: whereClause,
            }) as Promise<number>
          ).pipe(
            map((total: number) => ({
              data: prismaInvitations.map((p: any) => InvitationMapper.toDomain(p)),
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            }))
          )
        )
      ),
      shareReplay(1)
    )
  }

  updateManyExpired(): Observable<{ count: number }> {
    return defer(() =>
      from(
        this.prisma.invitation.updateMany({
          where: {
            status: InvitationStatus.PENDING,
            expiresAt: { lt: new Date() },
          },
          data: { status: InvitationStatus.EXPIRED },
        }) as Promise<{ count: number }>
      )
    ).pipe(map((result: { count: number }) => ({ count: result.count })))
  }
}
