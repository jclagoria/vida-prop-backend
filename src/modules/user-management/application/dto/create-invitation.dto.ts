import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { UserRole } from '../../domain/enums/user-role.enum'

export class CreateInvitationDto {
  @IsEmail()
  email!: string

  @IsEnum(UserRole)
  role!: UserRole

  @IsOptional()
  @IsString()
  apartmentId?: string

  @IsOptional()
  @IsString()
  buildingId?: string
}
