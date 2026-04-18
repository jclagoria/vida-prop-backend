import { of } from 'rxjs'
import type {
  CsvParserService,
  ParsedApartment,
} from '@/modules/building-management/infrastructure/services/csv-parser.service'
import { UniqueIdentifierService } from '@/modules/building-management/infrastructure/services/unique-identifier.service'
import { CsvImportStrategy } from '@/modules/building-management/infrastructure/strategies/csv-import.strategy'

const mockCsvParserService = {
  parseApartmentCsv: jest.fn(),
}

describe('CsvImportStrategy', () => {
  let strategy: CsvImportStrategy
  let mockRepository: any

  beforeEach(() => {
    mockRepository = {
      bulkCreate: jest.fn(),
      findByUniqueIdentifier: jest.fn().mockReturnValue(of(null)),
    }

    strategy = new CsvImportStrategy(
      new UniqueIdentifierService(),
      mockCsvParserService as unknown as CsvParserService,
      mockRepository
    )
  })

  describe('execute', () => {
    it('should import valid CSV', async () => {
      const apartments: ParsedApartment[] = [
        { floorId: 'f1', unitNumber: '01', totalRooms: 2, totalArea: 50 },
      ]
      mockCsvParserService.parseApartmentCsv.mockReturnValue(of(apartments))
      mockRepository.bulkCreate.mockReturnValue(of([{}]))

      const result = await strategy.execute('csv data')

      expect(result.success).toHaveLength(1)
      expect(result.failed).toHaveLength(0)
    })

    it('should skip duplicates when configured', async () => {
      const options = { skipDuplicates: true, validateOnly: false, batchSize: 100 }
      mockRepository.findByUniqueIdentifier.mockReturnValue(of({ id: 'existing' }))

      const result = await strategy.execute('csv data', options)

      expect(result.success).toHaveLength(0)
    })

    it('should report failed rows with errors', async () => {
      mockCsvParserService.parseApartmentCsv.mockReturnValue(
        of([{ floorId: '', unitNumber: '01', totalRooms: 2, totalArea: 50 }])
      )

      const result = await strategy.execute('csv data')

      expect(result.failed).toHaveLength(1)
    })
  })
})
