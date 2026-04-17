import { IsString, MinLength } from 'class-validator'

export class CreateBodyDto {
  @IsString()
  @MinLength(1)
  name!: string
}
