export class Password {
  private readonly value: string

  constructor(value: string) {
    if (!value) {
      throw new Error('Password cannot be empty')
    }
    this.value = value
  }

  getValue(): string {
    return this.value
  }

  meetsPolicy(): boolean {
    if (this.value.length < 8) {
      return false
    }
    if (!/[A-Z]/.test(this.value)) {
      return false
    }
    if (!/[0-9]/.test(this.value)) {
      return false
    }
    return true
  }

  getPolicyErrors(): string[] {
    const errors: string[] = []
    if (this.value.length < 8) {
      errors.push('Password must have at least 8 characters')
    }
    if (!/[A-Z]/.test(this.value)) {
      errors.push('Password must have at least 1 uppercase letter')
    }
    if (!/[0-9]/.test(this.value)) {
      errors.push('Password must have at least 1 number')
    }
    return errors
  }
}
