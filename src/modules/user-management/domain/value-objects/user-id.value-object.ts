const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export class UserId {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  get value(): string {
    return this._value
  }

  static create(value: string): UserId {
    if (!value || !UUID_REGEX.test(value)) {
      throw new Error('Invalid UUID format')
    }
    return new UserId(value)
  }

  static generate(): UserId {
    return new UserId(crypto.randomUUID())
  }

  equals(other: UserId): boolean {
    return this._value === other._value
  }
}
