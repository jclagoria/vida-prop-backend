import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type * as winston from 'winston'
import type { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import type { BulkApartmentData, IApartmentServicePort } from '../../ports/i-apartment.service'

@Injectable()
export class BulkCreateApartmentsUseCase {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger,
    private readonly apartmentService: IApartmentServicePort
  ) {}

  execute(apartments: BulkApartmentData[]): Observable<Apartment[]> {
    if (!apartments || apartments.length === 0) {
      return throwError(() => new Error('No apartments provided'))
    }

    return this.apartmentService.bulkCreate(apartments).pipe(
      catchError((error) => {
        this.logger.error('BulkCreateApartmentsUseCase.execute failed', {
          trace: error instanceof Error ? error.stack : undefined,
          context: 'BulkCreateApartmentsUseCase',
          operation: 'execute',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        return throwError(() => error)
      })
    )
  }
}
