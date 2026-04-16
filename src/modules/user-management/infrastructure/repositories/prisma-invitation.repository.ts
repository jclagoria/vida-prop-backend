import { Injectable } from '@nestjs/common'
import { defer, from, map, type Observable, shareReplay } from 'rxjs'
import type { Invitation } from '../../domain/entities/invitation.entity'
import type { IInvitationRepository } from '../../domain/interfaces/i-invitation.repository'
import { InvitationMapper } from './mappers/invitation.mapper'

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
}
