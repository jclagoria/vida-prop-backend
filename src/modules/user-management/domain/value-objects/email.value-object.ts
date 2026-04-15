const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class Email {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value.toLowerCase()
  }

  get value(): string {
    return this._value
  }

  static create(value: string): Email {
    if (!value || !EMAIL_REGEX.test(value)) {
      throw new Error('Invalid email format')
    }
    return new Email(value)
  }

  equals(other: Email): boolean {
    return this._value === other._value.toLowerCase()
  }
}
