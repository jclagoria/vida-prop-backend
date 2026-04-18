import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { defer, from, type Observable, throwError } from 'rxjs'
import { catchError, map, shareReplay } from 'rxjs/operators'
import type { CreateInput, UpdateInput } from './prisma-repository.interface'

@Injectable()
export abstract class PrismaBaseRepository<
  DomainEntity,
  PrismaEntity,
  CreateInput,
  UpdateInput,
  IdType = string,
> {
  protected readonly logger = new Logger(PrismaBaseRepository.name)

  protected constructor(
    protected readonly prisma: any,
    protected readonly entityName: string
  ) {}

  findById(id: IdType): Observable<DomainEntity | null> {
    const model = this.getModel()
    const idString = this.convertId(id)
    return defer(() => from(this.prisma[model].findUnique({ where: { id: idString } }))).pipe(
      map((result) => (result ? this.toDomain(result as PrismaEntity) : null)),
      shareReplay(1)
    )
  }

  findAll(): Observable<DomainEntity[]> {
    const model = this.getModel()
    return defer(() => from(this.prisma[model].findMany() as Promise<PrismaEntity[]>)).pipe(
      map((results) => results.map((r) => this.toDomain(r as PrismaEntity))),
      shareReplay(1)
    )
  }

  save(entity: DomainEntity): Observable<DomainEntity> {
    return defer(() =>
      from(
        this.prisma.$transaction(async (tx: any) => {
          const data = this.toPrismaCreate(entity)
          return tx[this.getModel()].create({ data })
        })
      )
    ).pipe(
      map((result) => this.toDomain(result as PrismaEntity)),
      catchError((error: unknown) => this.handleError(error, 'save', entity))
    )
  }

  update(entity: DomainEntity): Observable<DomainEntity> {
    return defer(() =>
      from(
        this.prisma.$transaction(async (tx: any) => {
          const data = this.toPrismaUpdate(entity)
          const idString = this.convertId(this.getId(entity))
          return tx[this.getModel()].update({ where: { id: idString }, data })
        })
      )
    ).pipe(
      map((result) => this.toDomain(result as PrismaEntity)),
      catchError((error: unknown) => this.handleError(error, 'update', entity))
    )
  }

  delete(id: IdType): Observable<void> {
    const idString = this.convertId(id)
    return defer(() =>
      from(
        this.prisma.$transaction(async (tx: any) => {
          return tx[this.getModel()].delete({ where: { id: idString } })
        })
      )
    ).pipe(
      map(() => undefined),
      catchError((error: unknown) => this.handleError(error, 'delete', { id: idString }))
    )
  }

  bulkCreate(entities: CreateInput[]): Observable<DomainEntity[]> {
    const model = this.getModel()
    return defer(() =>
      from(this.prisma.$transaction(entities.map((data) => this.prisma[model].create({ data }))))
    ).pipe(
      map((results: unknown) => (results as PrismaEntity[]).map((r) => this.toDomain(r))),
      catchError((error: unknown) =>
        this.handleError(error, 'bulkCreate', { count: entities.length })
      )
    )
  }

  protected convertId(id: IdType): string {
    if (typeof id === 'string') return id
    if (typeof id === 'number') return String(id)
    if (typeof id === 'object' && id !== null && 'toString' in id) {
      return (id as unknown as { toString(): string }).toString()
    }
    return String(id)
  }

  protected executeInTransaction<T>(operation: (tx: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(operation)
  }

  protected executeSequentially<T>(operations: Promise<T>[]): Promise<T[]> {
    return this.prisma.$transaction(operations)
  }

  protected abstract getModel(): string
  protected abstract toDomain(prismaEntity: PrismaEntity): DomainEntity
  protected abstract toPrismaCreate(entity: DomainEntity): CreateInput
  protected abstract toPrismaUpdate(entity: DomainEntity): UpdateInput
  protected abstract getId(entity: DomainEntity): IdType

  private handleError<T>(error: unknown, operation: string, context?: T): Observable<never> {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const contextData = context ? { [this.entityName.toLowerCase()]: context } : {}

    this.logger.error(`[${this.entityName}] ${operation} failed: ${message}`, contextData)

    return throwError(
      () =>
        new InternalServerErrorException(`Failed to ${operation} ${this.entityName.toLowerCase()}`)
    )
  }
}
