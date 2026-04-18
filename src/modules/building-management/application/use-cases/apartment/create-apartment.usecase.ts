import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { type Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import type * as winston from 'winston'
import type { Apartment } from '@/modules/building-management/domain/entities/apartment.entity'
import type { CreateApartmentDto } from '../../dto/create-apartment.dto'
import type { IApartmentServicePort } from '../../ports/i-apartment.service'
import type { IFloorServicePort } from '../../ports/i-floor.service'

@Injectable()
export class CreateApartmentUseCase {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger,
    private readonly floorService: IFloorServicePort,
    private readonly apartmentService: IApartmentServicePort
  ) {}

  execute(floorId: string, dto: CreateApartmentDto): Observable<Apartment> {
    return this.floorService.findById(floorId).pipe(
      switchMap((floor) => {
        if (!floor) {
          return throwError(() => new Error('Floor not found'))
        }
        return this.apartmentService.create(dto, floorId)
      }),
      catchError((error) => {
        this.logger.error('CreateApartmentUseCase.execute failed', {
          trace: error instanceof Error ? error.stack : undefined,
          context: 'CreateApartmentUseCase',
          operation: 'execute',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        return throwError(() => error)
      })
    )
  }
}
