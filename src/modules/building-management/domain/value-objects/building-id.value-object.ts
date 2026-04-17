export class BuildingId {
  private readonly value: string

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('BuildingId cannot be empty')
    }
    this.value = value
  }

  toString(): string {
    return this.value
  }

  equals(other: BuildingId): boolean {
    if (!(other instanceof BuildingId)) {
      return false
    }
    return this.value === other.value
  }
}
