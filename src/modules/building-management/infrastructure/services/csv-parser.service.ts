import { Injectable } from '@nestjs/common'
import { defer, type Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface ParsedApartment {
  floorId: string
  unitNumber: string
  totalRooms: number
  totalArea: number
}

@Injectable()
export class CsvParserService {
  parseApartmentCsv(csv: string): Observable<ParsedApartment[]> {
    const parse = (): ParsedApartment[] => {
      const lines = csv.trim().split('\n')
      if (lines.length < 2) {
        throw new Error('CSV must have at least a header and one data row')
      }

      const headers = this.parseLine(lines[0])
      this.validateHeaders(headers)

      const apartments: ParsedApartment[] = lines.slice(1).map((line) => {
        const values = this.parseLine(line)
        return this.mapToApartment(headers, values)
      })

      return apartments
    }

    return defer(() => parse() as unknown as Promise<ParsedApartment[]>).pipe(
      map((v) => v as ParsedApartment[])
    )
  }

  private parseLine(line: string): string[] {
    return line.split(',').map((v) => v.trim())
  }

  private validateHeaders(headers: string[]): void {
    const requiredHeaders = ['floorId', 'unitNumber', 'totalRooms', 'totalArea']
    const missing = requiredHeaders.filter((h) => !headers.includes(h))

    if (missing.length > 0) {
      throw new Error(`Missing required columns: ${missing.join(', ')}`)
    }
  }

  private mapToApartment(headers: string[], values: string[]): ParsedApartment {
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = values[i]
    })

    const totalRooms = parseInt(obj.totalRooms, 10)
    const totalArea = parseFloat(obj.totalArea)

    if (Number.isNaN(totalRooms) || totalRooms < 1) {
      throw new Error(`Invalid totalRooms: ${obj.totalRooms}`)
    }

    if (Number.isNaN(totalArea) || totalArea < 1) {
      throw new Error(`Invalid totalArea: ${obj.totalArea}`)
    }

    return {
      floorId: obj.floorId,
      unitNumber: obj.unitNumber,
      totalRooms,
      totalArea,
    }
  }
}
