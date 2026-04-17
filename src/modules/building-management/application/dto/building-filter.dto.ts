import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Country } from '@/modules/building-management/domain/enums/country.enum'

export class BuildingFilterDto {
  @IsOptional()
  @IsEnum(Country)
  country?: Country

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20
}
