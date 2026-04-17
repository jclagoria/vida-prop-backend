import { Injectable, Logger } from '@nestjs/common'
import { Observable, type Observable as ObservableType, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import type { IApartmentServicePort } from '../../ports/i-apartment.service'

@Injectable()
export class GetApartmentByIdentifierUseCase {
  private readonly logger = new Logger(GetApartmentByIdentifierUseCase.name)

  constructor(private readonly apartmentService: IApartmentServicePort) {}

  execute(uniqueIdentifier: string): Observable<Apartment> {
    return this.apartmentService.findByUniqueIdentifier(uniqueIdentifier).pipe(
      switchMap((apartment) => {
        if (!apartment) {
          return throwError(() => new Error('Apartment not found'))
        }
        return new Observable<Apartment>((subscriber) => subscriber.next(apartment))
      }),
      catchError((error) => {
        this.logger.error(
          'GetApartmentByIdentifierUseCase.execute failed',
          error instanceof Error ? error.stack : undefined,
          {
            useCase: 'GetApartmentByIdentifierUseCase',
            operation: 'execute',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        )
        return throwError(() => error)
      })
    )
  }
}
