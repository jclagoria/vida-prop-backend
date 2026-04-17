import type { Building } from '../entities/building.entity'
import { UniqueIdentifier } from '../value-objects/unique-identifier.value-object'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export class BuildingDomainService {
  generateIdentifier(
    building: Building,
    bodyName: string | undefined,
    floorNumber: number,
    unitNumber: string
  ): UniqueIdentifier {
    return UniqueIdentifier.create(building.code, floorNumber, unitNumber, bodyName)
  }

  validateBuilding(building: Building): ValidationResult {
    const errors: string[] = []

    if (!building.name || building.name.trim().length === 0) {
      errors.push('Building name is required')
    }
    if (!building.code || building.code.trim().length === 0) {
      errors.push('Building code is required')
    }
    if (!building.city || building.city.trim().length === 0) {
      errors.push('City is required')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  canDeleteBuilding(building: Building): boolean {
    return true
  }
}
