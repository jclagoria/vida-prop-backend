import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { defer, from, type Observable, throwError } from 'rxjs'
import { catchError, map, shareReplay } from 'rxjs/operators'
import type { Body } from '@/modules/building-management/domain/entities/body.entity'
import type { IBodyRepository } from '@/modules/building-management/domain/interfaces/i-body.repository'
import type { BodyId } from '@/modules/building-management/domain/value-objects/body-id.value-object'
import type { BuildingId } from '@/modules/building-management/domain/value-objects/building-id.value-object'
import { BodyMapper } from '../mappers/body.mapper'

@Injectable()
export class PrismaBodyRepository implements IBodyRepository {
  private prisma: any

  constructor(prisma: any) {
    this.prisma = prisma
  }

  findById(id: BodyId): Observable<Body | null> {
    return defer(() => from(this.prisma.body.findUnique({ where: { id: id.toString() } }))).pipe(
      map((prismaBody: any) => (prismaBody ? BodyMapper.toDomain(prismaBody) : null)),
      shareReplay(1)
    )
  }

  findByBuildingId(buildingId: BuildingId): Observable<Body[]> {
    return defer(
      () =>
        from(
          this.prisma.body.findMany({ where: { buildingId: buildingId.toString() } })
        ) as unknown as Promise<any>
    ).pipe(
      map((prismaBodies: any) => (prismaBodies as any[]).map((p) => BodyMapper.toDomain(p)))
    ) as Observable<Body[]>
  }

  save(body: Body): Observable<Body> {
    const data = BodyMapper.toPrismaCreate(body)
    return defer(() =>
      from(
        this.prisma.$transaction(async (tx: any) => {
          const created = await tx.body.create({ data })
          return created
        })
      )
    ).pipe(
      map((prismaBody: any) => BodyMapper.toDomain(prismaBody)),
      catchError((error) => {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('[PrismaBodyRepository] Transaction failed', {
          error: message,
          bodyId: body.id.toString(),
        })
        return throwError(() => new InternalServerErrorException('Failed to save body'))
      })
    )
  }

  delete(id: BodyId): Observable<void> {
    return defer(() => from(this.prisma.body.delete({ where: { id: id.toString() } }))).pipe(
      map(() => undefined)
    )
  }
}
