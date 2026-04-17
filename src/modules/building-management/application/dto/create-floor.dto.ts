import { IsInt, Max, Min } from 'class-validator'

export class CreateFloorDto {
  @IsInt()
  @Min(0)
  @Max(100)
  floorNumber!: number
}
