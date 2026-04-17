import { take } from 'rxjs/operators'
import {
  CsvParserService,
  ParsedApartment,
} from '@/modules/building-management/infrastructure/services/csv-parser.service'

describe('CsvParserService', () => {
  let service: CsvParserService

  beforeEach(() => {
    service = new CsvParserService()
  })

  describe('parseApartmentCsv', () => {
    it('should parse valid CSV', (done) => {
      const csv = 'floorId,unitNumber,totalRooms,totalArea\nf1,01,2,50'

      service
        .parseApartmentCsv(csv)
        .pipe(take(1))
        .subscribe({
          next: (apartments) => {
            expect(apartments).toHaveLength(1)
            expect(apartments[0].unitNumber).toBe('01')
            expect(apartments[0].totalRooms).toBe(2)
            expect(apartments[0].totalArea).toBe(50)
            done()
          },
          error: done.fail,
        })
    })

    it('should parse multiple rows', (done) => {
      const csv = 'floorId,unitNumber,totalRooms,totalArea\nf1,01,2,50\nf1,02,3,75'

      service
        .parseApartmentCsv(csv)
        .pipe(take(1))
        .subscribe({
          next: (apartments) => {
            expect(apartments).toHaveLength(2)
            expect(apartments[1].unitNumber).toBe('02')
            done()
          },
          error: done.fail,
        })
    })

    it('should throw for missing required columns', (done) => {
      const csv = 'floorId,unitNumber\nf1,01'

      service
        .parseApartmentCsv(csv)
        .pipe(take(1))
        .subscribe({
          next: () => done.fail('Should have thrown'),
          error: (error) => {
            expect(error.message).toContain('Missing required columns')
            done()
          },
        })
    })

    it('should throw for invalid totalRooms', (done) => {
      const csv = 'floorId,unitNumber,totalRooms,totalArea\nf1,01,invalid,50'

      service
        .parseApartmentCsv(csv)
        .pipe(take(1))
        .subscribe({
          next: () => done.fail('Should have thrown'),
          error: (error) => {
            expect(error.message).toContain('Invalid totalRooms')
            done()
          },
        })
    })

    it('should throw for invalid totalArea', (done) => {
      const csv = 'floorId,unitNumber,totalRooms,totalArea\nf1,01,2,invalid'

      service
        .parseApartmentCsv(csv)
        .pipe(take(1))
        .subscribe({
          next: () => done.fail('Should have thrown'),
          error: (error) => {
            expect(error.message).toContain('Invalid totalArea')
            done()
          },
        })
    })

    it('should throw for empty CSV', (done) => {
      const csv = ''

      service
        .parseApartmentCsv(csv)
        .pipe(take(1))
        .subscribe({
          next: () => done.fail('Should have thrown'),
          error: (error) => {
            expect(error.message).toContain('CSV must have at least a header')
            done()
          },
        })
    })
  })
})
