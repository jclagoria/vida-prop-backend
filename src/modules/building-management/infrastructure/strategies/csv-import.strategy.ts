import { Injectable } from '@nestjs/common'
import { firstValueFrom, type Observable, of } from 'rxjs'
import type { CsvParserService, ParsedApartment } from '../services/csv-parser.service'
import type { UniqueIdentifierService } from '../services/unique-identifier.service'

export interface CsvImportOptions {
  skipDuplicates: boolean
  validateOnly: boolean
  batchSize: number
}

export interface CsvImportResult {
  success: (ParsedApartment & { uniqueIdentifier: string })[]
  failed: CsvImportError[]
  totalProcessed: number
}

export interface CsvImportError {
  row: number
  error: string
  data: string
}

export interface IApartmentRepository {
  findByUniqueIdentifier(id: string): Observable<Apartment | null>
  bulkCreate(apartments: ApartmentInput[]): Observable<Apartment[]>
}

interface Apartment {
  id: string
}

interface ApartmentInput {
  floorId: string
  unitNumber: string
  uniqueIdentifier: string
  totalRooms: number
  totalArea: number
}

@Injectable()
export class CsvImportStrategy {
  constructor(
    _uniqueIdentifierService: UniqueIdentifierService,
    private csvParserService: CsvParserService,
    private apartmentRepository: IApartmentRepository
  ) {}

  async execute(
    csv: string,
    options: CsvImportOptions = {
      skipDuplicates: true,
      validateOnly: false,
      batchSize: 100,
    }
  ): Promise<CsvImportResult> {
    const apartments = await firstValueFrom(this.csvParserService.parseApartmentCsv(csv))

    const result: CsvImportResult = {
      success: [],
      failed: [],
      totalProcessed: 0,
    }

    for (let i = 0; i < apartments.length; i++) {
      const apartment = apartments[i]

      try {
        this.validateApartmentData(apartment, i + 1)

        if (options.skipDuplicates) {
          const exists = await firstValueFrom(
            this.apartmentRepository.findByUniqueIdentifier(
              `${apartment.floorId}-${apartment.unitNumber}`
            )
          )
          if (exists) {
            continue
          }
        }

        result.success.push({
          ...apartment,
          uniqueIdentifier: `${apartment.floorId}-${apartment.unitNumber}`,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        result.failed.push({
          row: i + 1,
          error: message,
          data: JSON.stringify(apartment),
        })
      }
    }

    result.totalProcessed = apartments.length

    if (!options.validateOnly && result.success.length > 0) {
      await this.bulkCreate(result.success, options.batchSize)
    }

    return result
  }

  private async bulkCreate(
    apartments: (ParsedApartment & { uniqueIdentifier: string })[],
    batchSize: number
  ): Promise<void> {
    for (let i = 0; i < apartments.length; i += batchSize) {
      const batch = apartments.slice(i, i + batchSize)
      await firstValueFrom(
        this.apartmentRepository.bulkCreate(
          batch.map((a) => ({
            floorId: a.floorId,
            unitNumber: a.unitNumber,
            uniqueIdentifier: a.uniqueIdentifier,
            totalRooms: a.totalRooms,
            totalArea: a.totalArea,
          }))
        )
      )
    }
  }

  private validateApartmentData(data: ParsedApartment, row: number): void {
    if (!data.floorId) {
      throw new Error(`Row ${row}: floorId is required`)
    }
    if (!data.unitNumber) {
      throw new Error(`Row ${row}: unitNumber is required`)
    }
    if (!data.totalRooms || data.totalRooms < 1) {
      throw new Error(`Row ${row}: totalRooms must be >= 1`)
    }
    if (!data.totalArea || data.totalArea <= 0) {
      throw new Error(`Row ${row}: totalArea must be > 0`)
    }
  }
}
