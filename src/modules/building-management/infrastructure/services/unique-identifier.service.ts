import { Injectable } from '@nestjs/common'

export interface ParsedIdentifier {
  buildingCode: string
  bodyName: string | null
  floorNumber: number
  unitNumber: string
}

@Injectable()
export class UniqueIdentifierService {
  generate(
    buildingCode: string,
    bodyName: string | null,
    floorNumber: number,
    unitNumber: string
  ): string {
    const bodyPart = bodyName ? bodyName : ''
    const floorPart = floorNumber.toString().padStart(3, '0')
    const unitPart = unitNumber.toString().padStart(2, '0')

    return `${buildingCode}-${bodyPart}-${floorPart}${unitPart}`
  }

  parse(uniqueIdentifier: string): ParsedIdentifier {
    const parts = uniqueIdentifier.split('-')

    if (parts.length < 3) {
      throw new Error('Invalid unique identifier format')
    }

    const buildingCode = parts[0]
    const bodyName = parts[1] || null

    const lastPart = parts[parts.length - 1]
    const floorNumber = parseInt(lastPart.slice(0, 3), 10)
    const unitNumber = lastPart.slice(3)

    return {
      buildingCode,
      bodyName,
      floorNumber,
      unitNumber,
    }
  }

  validate(uniqueIdentifier: string): boolean {
    try {
      const parsed = this.parse(uniqueIdentifier)
      return !!parsed.buildingCode && !Number.isNaN(parsed.floorNumber)
    } catch {
      return false
    }
  }

  extractBuildingCode(uniqueIdentifier: string): string {
    return this.parse(uniqueIdentifier).buildingCode
  }
}
