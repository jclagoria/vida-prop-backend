import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator'
import { Country } from '@/modules/building-management/domain/enums/country.enum'

export class CreateBuildingDto {
  @IsString()
  @MinLength(1)
  name!: string

  @IsString()
  @MinLength(1)
  address!: string

  @IsString()
  @MinLength(1)
  city!: string

  @IsEnum(Country)
  country!: Country

  @IsString()
  @MinLength(1)
  code!: string

  @IsOptional()
  @IsString()
  notes?: string
}
