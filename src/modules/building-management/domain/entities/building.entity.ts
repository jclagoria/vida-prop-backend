import type { Country } from '../enums/country.enum'
import type { Address } from '../value-objects/address.value-object'
import { BuildingId } from '../value-objects/building-id.value-object'

export interface BuildingProps {
  id: BuildingId
  name: string
  address: Address
  code: string
  city: string
  country: Country
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export class Building {
  private readonly props: BuildingProps

  constructor(props: BuildingProps) {
    this.props = props
  }

  static create(props: Omit<BuildingProps, 'id' | 'createdAt' | 'updatedAt'>): Building {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Building name is required')
    }
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Building code is required')
    }
    if (!props.city || props.city.trim().length === 0) {
      throw new Error('City is required')
    }
    if (!props.country) {
      throw new Error('Country is required')
    }

    const now = new Date()
    return new Building({
      ...props,
      id: new BuildingId(crypto.randomUUID()),
      name: props.name.trim(),
      code: props.code.trim().toUpperCase(),
      city: props.city.trim(),
      country: props.country,
      notes: props.notes?.trim(),
      createdAt: now,
      updatedAt: now,
    })
  }

  get id(): BuildingId {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get address(): Address {
    return this.props.address
  }

  get code(): string {
    return this.props.code
  }

  get city(): string {
    return this.props.city
  }

  get country(): Country {
    return this.props.country
  }

  get notes(): string | undefined {
    return this.props.notes
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  update(
    props: Partial<Pick<BuildingProps, 'name' | 'address' | 'code' | 'city' | 'notes'>>
  ): Building {
    return new Building({
      ...this.props,
      name: props.name?.trim() ?? this.props.name,
      address: props.address ?? this.props.address,
      code: props.code?.trim().toUpperCase() ?? this.props.code,
      city: props.city?.trim() ?? this.props.city,
      notes: props.notes?.trim() ?? this.props.notes,
      updatedAt: new Date(),
    })
  }

  equals(other: Building): boolean {
    if (!(other instanceof Building)) {
      return false
    }
    return this.props.id.equals(other.props.id)
  }

  toPlain(): Record<string, unknown> {
    return {
      id: this.props.id.toString(),
      name: this.props.name,
      address: this.props.address.toString(),
      code: this.props.code,
      city: this.props.city,
      country: this.props.country,
      notes: this.props.notes,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }
}
