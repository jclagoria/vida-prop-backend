import { Expose, Transform } from 'class-transformer'
import type { Country } from '@/modules/building-management/domain/enums/country.enum'

export class BuildingResponseDto {
  @Expose()
  id!: string

  @Expose()
  name!: string

  @Expose()
  address!: string

  @Expose()
  city!: string

  @Expose()
  country!: Country

  @Expose()
  code!: string

  @Expose()
  notes?: string

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  updatedAt!: Date

  static fromEntity(entity: {
    id: { toString(): string }
    name: string
    address: { toString(): string }
    city: string
    country: Country
    code: string
    notes?: string
    createdAt: Date
    updatedAt: Date
  }): BuildingResponseDto {
    const dto = new BuildingResponseDto()
    dto.id = entity.id.toString()
    dto.name = entity.name
    dto.address = entity.address.toString()
    dto.city = entity.city
    dto.country = entity.country
    dto.code = entity.code
    dto.notes = entity.notes
    dto.createdAt = entity.createdAt
    dto.updatedAt = entity.updatedAt
    return dto
  }
}
