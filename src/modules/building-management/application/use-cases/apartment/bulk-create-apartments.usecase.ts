import { Injectable, Logger } from '@nestjs/common'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import type { BulkApartmentData, IApartmentServicePort } from '../../ports/i-apartment.service'

@Injectable()
export class BulkCreateApartmentsUseCase {
  private readonly logger = new Logger(BulkCreateApartmentsUseCase.name)

  constructor(private readonly apartmentService: IApartmentServicePort) {}

  execute(apartments: BulkApartmentData[]): Observable<Apartment[]> {
    if (!apartments || apartments.length === 0) {
      return throwError(() => new Error('No apartments provided'))
    }

    return this.apartmentService.bulkCreate(apartments).pipe(
      catchError((error) => {
        this.logger.error(
          'BulkCreateApartmentsUseCase.execute failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'BulkCreateApartmentsUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        return throwError(() => error)
      })
    )
  }
}
