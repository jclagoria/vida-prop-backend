export class BodyId {
  private readonly value: string

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('BodyId cannot be empty')
    }
    this.value = value
  }

  toString(): string {
    return this.value
  }

  equals(other: BodyId): boolean {
    if (!(other instanceof BodyId)) {
      return false
    }
    return this.value === other.value
  }
}
