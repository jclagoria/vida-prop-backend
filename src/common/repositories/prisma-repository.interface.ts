import type { Observable } from 'rxjs'

export interface IPrismaRepository<Entity> {
  findById(id: string): Observable<Entity | null>
  findAll(): Observable<Entity[]>
  save(entity: Entity): Observable<Entity>
  update(entity: Entity): Observable<Entity>
  delete(id: string): Observable<void>
}

export interface CreateInput {
  [key: string]: unknown
}

export interface UpdateInput {
  [key: string]: unknown
}
