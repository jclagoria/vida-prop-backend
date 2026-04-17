export class ApartmentId {
  private readonly value: string

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ApartmentId cannot be empty')
    }
    this.value = value
  }

  toString(): string {
    return this.value
  }

  equals(other: ApartmentId): boolean {
    if (!(other instanceof ApartmentId)) {
      return false
    }
    return this.value === other.value
  }
}
