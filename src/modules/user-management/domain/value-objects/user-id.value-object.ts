export class UserId {
  private readonly value: string

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UserId cannot be empty')
    }
    this.value = value
  }

  toString(): string {
    return this.value
  }

  equals(other: UserId): boolean {
    if (!(other instanceof UserId)) {
      return false
    }
    return this.value === other.value
  }
}
