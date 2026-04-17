import type { Country } from '../enums/country.enum'

export interface AddressProps {
  street: string
  number: string
  city: string
  country: Country
  postalCode?: string
}

export class Address {
  private readonly props: Readonly<AddressProps>

  private constructor(props: AddressProps) {
    this.props = Object.freeze(props)
  }

  static create(props: AddressProps): Address {
    if (!props.street || props.street.trim().length === 0) {
      throw new Error('Street is required')
    }
    if (!props.number || props.number.trim().length === 0) {
      throw new Error('Street number is required')
    }
    if (!props.city || props.city.trim().length === 0) {
      throw new Error('City is required')
    }
    if (!props.country) {
      throw new Error('Country is required')
    }

    return new Address({
      street: props.street.trim(),
      number: props.number.trim(),
      city: props.city.trim(),
      country: props.country,
      postalCode: props.postalCode?.trim(),
    })
  }

  get street(): string {
    return this.props.street
  }

  get number(): string {
    return this.props.number
  }

  get city(): string {
    return this.props.city
  }

  get country(): Country {
    return this.props.country
  }

  get postalCode(): string | undefined {
    return this.props.postalCode
  }

  equals(other: Address): boolean {
    if (!(other instanceof Address)) {
      return false
    }
    return (
      this.props.street === other.props.street &&
      this.props.number === other.props.number &&
      this.props.city === other.props.city &&
      this.props.country === other.props.country
    )
  }

  toString(): string {
    const parts = [this.props.street, this.props.number, this.props.city]
    if (this.props.postalCode) {
      parts.push(this.props.postalCode)
    }
    parts.push(this.props.country)
    return parts.join(', ')
  }
}
