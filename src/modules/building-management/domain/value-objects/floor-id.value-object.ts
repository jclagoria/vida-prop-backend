export class FloorId {
  private readonly value: string

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('FloorId cannot be empty')
    }
    this.value = value
  }

  toString(): string {
    return this.value
  }

  equals(other: FloorId): boolean {
    if (!(other instanceof FloorId)) {
      return false
    }
    return this.value === other.value
  }
}
