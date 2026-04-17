import type { BodyId } from '../value-objects/body-id.value-object'
import { FloorId } from '../value-objects/floor-id.value-object'

export interface FloorProps {
  id: FloorId
  bodyId: BodyId
  floorNumber: number
}

export class Floor {
  private readonly props: FloorProps

  constructor(props: FloorProps) {
    this.props = props
  }

  static create(bodyId: BodyId, floorNumber: number): Floor {
    if (!bodyId) {
      throw new Error('BodyId is required')
    }
    if (floorNumber === undefined || floorNumber < 0) {
      throw new Error('Floor number must be a non-negative number')
    }

    return new Floor({
      id: new FloorId(crypto.randomUUID()),
      bodyId,
      floorNumber,
    })
  }

  get id(): FloorId {
    return this.props.id
  }

  get bodyId(): BodyId {
    return this.props.bodyId
  }

  get floorNumber(): number {
    return this.props.floorNumber
  }

  update(floorNumber: number): Floor {
    if (floorNumber < 0) {
      throw new Error('Floor number must be a non-negative number')
    }
    return new Floor({
      ...this.props,
      floorNumber,
    })
  }

  equals(other: Floor): boolean {
    if (!(other instanceof Floor)) {
      return false
    }
    return this.props.id.equals(other.props.id)
  }

  toPlain(): Record<string, unknown> {
    return {
      id: this.props.id.toString(),
      bodyId: this.props.bodyId.toString(),
      floorNumber: this.props.floorNumber,
    }
  }
}
