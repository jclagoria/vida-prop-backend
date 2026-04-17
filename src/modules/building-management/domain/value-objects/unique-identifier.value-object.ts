export interface UniqueIdentifierProps {
  buildingCode: string
  bodyName?: string
  floorNumber: number
  unitNumber: string
  value: string
}

export class UniqueIdentifier {
  private readonly props: UniqueIdentifierProps

  private constructor(props: UniqueIdentifierProps) {
    this.props = props
  }

  static create(
    buildingCode: string,
    floorNumber: number,
    unitNumber: string,
    bodyName?: string
  ): UniqueIdentifier {
    if (!buildingCode || buildingCode.trim().length === 0) {
      throw new Error('Building code is required')
    }
    if (!floorNumber || floorNumber < 0) {
      throw new Error('Floor number must be a positive number')
    }
    if (!unitNumber || unitNumber.trim().length === 0) {
      throw new Error('Unit number is required')
    }

    const bodyPart = bodyName ? `-${bodyName}` : '--'
    const paddedFloor = floorNumber.toString().padStart(3, '0')
    const paddedUnit = unitNumber.toString().padStart(2, '0')
    const value = `${buildingCode}${bodyPart}-${paddedFloor}${paddedUnit}`

    return new UniqueIdentifier({
      buildingCode,
      bodyName,
      floorNumber,
      unitNumber,
      value,
    })
  }

  get buildingCode(): string {
    return this.props.buildingCode
  }

  get bodyName(): string | undefined {
    return this.props.bodyName
  }

  get floorNumber(): number {
    return this.props.floorNumber
  }

  get unitNumber(): string {
    return this.props.unitNumber
  }

  get value(): string {
    return this.props.value
  }

  equals(other: UniqueIdentifier): boolean {
    if (!(other instanceof UniqueIdentifier)) {
      return false
    }
    return this.props.value === other.props.value
  }

  toString(): string {
    return this.props.value
  }
}
