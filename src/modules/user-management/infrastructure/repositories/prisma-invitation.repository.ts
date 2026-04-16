import { Injectable } from '@nestjs/common'
import { defer, type Observable } from 'rxjs'
import { catchError, map, shareReplay } from 'rxjs/operators'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity.js'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum.js'
import type { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import type { IInvitationRepository } from '@/modules/user-management/domain/interfaces/i-invitation.repository.js'
import type { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { Email as EmailVO } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import type { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'
import { UserId as UserIdVO } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'
import type { InvitationModel, PrismaClient } from '@/types/prisma.js'

@Injectable()
export class PrismaInvitationRepository implements IInvitationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findById(id: string): Observable<Invitation | null> {
    return defer(() =>
      this.prisma.invitation.findUnique({
        where: { id },
      })
    ).pipe(
      map((inv) => (inv ? this.mapToDomain(inv) : null)),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  findByToken(token: string): Observable<Invitation | null> {
    return defer(() =>
      this.prisma.invitation.findUnique({
        where: { token },
      })
    ).pipe(
      map((inv) => (inv ? this.mapToDomain(inv) : null)),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  findByEmail(email: Email, status?: InvitationStatus): Observable<Invitation | null> {
    return defer(() =>
      this.prisma.invitation.findFirst({
        where: {
          email: email.value,
          ...(status ? { status } : {}),
        },
      })
    ).pipe(
      map((inv) => (inv ? this.mapToDomain(inv) : null)),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  findByCreator(createdById: UserId): Observable<Invitation[]> {
    return defer(() =>
      this.prisma.invitation.findMany({
        where: { createdById: createdById.value },
      })
    ).pipe(
      map((invitations) => invitations.map((inv) => this.mapToDomain(inv))),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  save(invitation: Invitation): Observable<Invitation> {
    return defer(() =>
      this.prisma.invitation.create({
        data: {
          id: invitation.id,
          email: invitation.email.value,
          role: invitation.role as UserRole,
          token: invitation.token,
          status: invitation.status as InvitationStatus,
          expiresAt: invitation.expiresAt,
          createdAt: invitation.createdAt,
          createdById: invitation.createdById.value,
          apartmentId: invitation.apartmentId ?? null,
          buildingId: invitation.buildingId ?? null,
        },
      })
    ).pipe(
      map((prismaInv) => this.mapToDomain(prismaInv)),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  update(invitation: Invitation): Observable<Invitation> {
    return defer(() =>
      this.prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: invitation.status as InvitationStatus,
          expiresAt: invitation.expiresAt,
        },
      })
    ).pipe(
      map((prismaInv) => this.mapToDomain(prismaInv)),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  delete(id: string): Observable<void> {
    return defer(() =>
      this.prisma.invitation.delete({
        where: { id },
      })
    ).pipe(
      map(() => undefined),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  deleteExpired(): Observable<number> {
    return defer(() =>
      this.prisma.invitation.updateMany({
        where: {
          status: InvitationStatus.PENDING,
          expiresAt: { lt: new Date() },
        },
        data: { status: InvitationStatus.EXPIRED },
      })
    ).pipe(
      map((result) => result.count),
      shareReplay(1),
      catchError((error) => {
        throw error
      })
    )
  }

  private mapToDomain(prismaInvitation: InvitationModel): Invitation {
    return Invitation.create({
      id: prismaInvitation.id,
      email: EmailVO.create(prismaInvitation.email),
      role: prismaInvitation.role as UserRole,
      token: prismaInvitation.token,
      status: prismaInvitation.status as InvitationStatus,
      expiresAt: prismaInvitation.expiresAt,
      createdById: UserIdVO.create(prismaInvitation.createdById),
      apartmentId: prismaInvitation.apartmentId ?? undefined,
      buildingId: prismaInvitation.buildingId ?? undefined,
      createdAt: prismaInvitation.createdAt,
    })
  }
}
