import { ApartmentStatus } from '../enums/apartment-status.enum'
import { ApartmentId } from '../value-objects/apartment-id.value-object'
import type { FloorId } from '../value-objects/floor-id.value-object'
import type { UniqueIdentifier } from '../value-objects/unique-identifier.value-object'

export interface ApartmentProps {
  id: ApartmentId
  floorId: FloorId
  unitNumber: string
  uniqueIdentifier: UniqueIdentifier
  totalRooms: number
  totalArea: number
  status: ApartmentStatus
}

const VALID_STATUS_TRANSITIONS: Record<ApartmentStatus, ApartmentStatus[]> = {
  [ApartmentStatus.AVAILABLE]: [
    ApartmentStatus.OCCUPIED,
    ApartmentStatus.MAINTENANCE,
    ApartmentStatus.UNAVAILABLE,
  ],
  [ApartmentStatus.OCCUPIED]: [
    ApartmentStatus.AVAILABLE,
    ApartmentStatus.MAINTENANCE,
    ApartmentStatus.UNAVAILABLE,
  ],
  [ApartmentStatus.MAINTENANCE]: [
    ApartmentStatus.AVAILABLE,
    ApartmentStatus.OCCUPIED,
    ApartmentStatus.UNAVAILABLE,
  ],
  [ApartmentStatus.UNAVAILABLE]: [ApartmentStatus.MAINTENANCE],
}

export class Apartment {
  private readonly props: ApartmentProps

  constructor(props: ApartmentProps) {
    this.props = props
  }

  static create(
    floorId: FloorId,
    unitNumber: string,
    uniqueIdentifier: UniqueIdentifier,
    totalRooms: number,
    totalArea: number
  ): Apartment {
    if (!floorId) {
      throw new Error('FloorId is required')
    }
    if (!unitNumber || unitNumber.trim().length === 0) {
      throw new Error('Unit number is required')
    }
    if (!uniqueIdentifier) {
      throw new Error('Unique identifier is required')
    }
    if (!Number.isInteger(totalRooms) || totalRooms < 0) {
      throw new Error('Total rooms must be a non-negative integer')
    }
    if (totalArea <= 0) {
      throw new Error('Total area must be greater than zero')
    }

    return new Apartment({
      id: new ApartmentId(crypto.randomUUID()),
      floorId,
      unitNumber: unitNumber.trim(),
      uniqueIdentifier,
      totalRooms,
      totalArea,
      status: ApartmentStatus.AVAILABLE,
    })
  }

  get id(): ApartmentId {
    return this.props.id
  }

  get floorId(): FloorId {
    return this.props.floorId
  }

  get unitNumber(): string {
    return this.props.unitNumber
  }

  get uniqueIdentifier(): UniqueIdentifier {
    return this.props.uniqueIdentifier
  }

  get totalRooms(): number {
    return this.props.totalRooms
  }

  get totalArea(): number {
    return this.props.totalArea
  }

  get status(): ApartmentStatus {
    return this.props.status
  }

  private canTransitionTo(newStatus: ApartmentStatus): boolean {
    return VALID_STATUS_TRANSITIONS[this.props.status]?.includes(newStatus) ?? false
  }

  private validateTransition(newStatus: ApartmentStatus): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(`Cannot transition from ${this.props.status} to ${newStatus}`)
    }
  }

  occupy(): Apartment {
    this.validateTransition(ApartmentStatus.OCCUPIED)
    return new Apartment({
      ...this.props,
      status: ApartmentStatus.OCCUPIED,
    })
  }

  vacate(): Apartment {
    this.validateTransition(ApartmentStatus.AVAILABLE)
    return new Apartment({
      ...this.props,
      status: ApartmentStatus.AVAILABLE,
    })
  }

  setMaintenance(): Apartment {
    return new Apartment({
      ...this.props,
      status: ApartmentStatus.MAINTENANCE,
    })
  }

  setUnavailable(): Apartment {
    this.validateTransition(ApartmentStatus.UNAVAILABLE)
    return new Apartment({
      ...this.props,
      status: ApartmentStatus.UNAVAILABLE,
    })
  }

  setAvailable(): Apartment {
    this.validateTransition(ApartmentStatus.AVAILABLE)
    return new Apartment({
      ...this.props,
      status: ApartmentStatus.AVAILABLE,
    })
  }

  equals(other: Apartment): boolean {
    if (!(other instanceof Apartment)) {
      return false
    }
    return this.props.id.equals(other.props.id)
  }

  toPlain(): Record<string, unknown> {
    return {
      id: this.props.id.toString(),
      floorId: this.props.floorId.toString(),
      unitNumber: this.props.unitNumber,
      uniqueIdentifier: this.props.uniqueIdentifier.toString(),
      totalRooms: this.props.totalRooms,
      totalArea: this.props.totalArea,
      status: this.props.status,
    }
  }
}
