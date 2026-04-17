import { BodyId } from '../value-objects/body-id.value-object'
import type { BuildingId } from '../value-objects/building-id.value-object'

export interface BodyProps {
  id: BodyId
  buildingId: BuildingId
  name: string
}

export class Body {
  private readonly props: BodyProps

  constructor(props: BodyProps) {
    this.props = props
  }

  static create(buildingId: BuildingId, name: string): Body {
    if (!name || name.trim().length === 0) {
      throw new Error('Body name is required')
    }
    if (!buildingId) {
      throw new Error('BuildingId is required')
    }

    return new Body({
      id: new BodyId(crypto.randomUUID()),
      buildingId,
      name: name.trim().toUpperCase(),
    })
  }

  get id(): BodyId {
    return this.props.id
  }

  get buildingId(): BuildingId {
    return this.props.buildingId
  }

  get name(): string {
    return this.props.name
  }

  update(name: string): Body {
    return new Body({
      ...this.props,
      name: name.trim().toUpperCase(),
    })
  }

  equals(other: Body): boolean {
    if (!(other instanceof Body)) {
      return false
    }
    return this.props.id.equals(other.props.id)
  }

  toPlain(): Record<string, unknown> {
    return {
      id: this.props.id.toString(),
      buildingId: this.props.buildingId.toString(),
      name: this.props.name,
    }
  }
}
