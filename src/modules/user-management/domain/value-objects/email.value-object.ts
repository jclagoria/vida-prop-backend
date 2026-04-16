export class Email {
  private readonly value: string

  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  constructor(value: string) {
    const trimmed = value.trim().toLowerCase()
    if (!Email.isValid(trimmed)) {
      throw new Error('Invalid email format')
    }
    this.value = trimmed
  }

  private static isValid(email: string): boolean {
    return Email.EMAIL_REGEX.test(email)
  }

  toString(): string {
    return this.value
  }

  getValue(): string {
    return this.value
  }

  equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false
    }
    return this.value === other.value
  }
}
