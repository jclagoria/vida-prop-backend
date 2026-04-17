import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'
import { ApartmentStatus } from '@/modules/building-management/domain/enums/apartment-status.enum'

export class CreateApartmentDto {
  @IsString()
  @Min(1)
  unitNumber!: string

  @IsInt()
  @Min(1)
  totalRooms!: number

  @IsInt()
  @Min(1)
  totalArea!: number

  @IsOptional()
  @IsEnum(ApartmentStatus)
  status?: ApartmentStatus
}
