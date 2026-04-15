export class Password {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  get value(): string {
    return this._value
  }

  static create(value: string): Password {
    if (!value) {
      throw new Error('Password is required')
    }
    if (value.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }
    if (!/[A-Z]/.test(value)) {
      throw new Error('Password must contain at least one uppercase letter')
    }
    if (!/[0-9]/.test(value)) {
      throw new Error('Password must contain at least one number')
    }
    return new Password(value)
  }

  equals(other: Password): boolean {
    return this._value === other._value
  }
}
