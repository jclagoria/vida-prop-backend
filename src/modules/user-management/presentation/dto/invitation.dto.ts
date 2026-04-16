import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'

export class CreateInvitationDto {
  @ApiProperty({ example: 'newuser@habitat.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ enum: UserRole, example: UserRole.TENANT })
  @IsEnum(UserRole)
  role!: UserRole

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  apartmentId?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  buildingId?: string
}

export class InvitationResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  email!: string

  @ApiProperty({ enum: UserRole })
  role!: UserRole

  @ApiProperty()
  status!: string

  @ApiProperty()
  expiresAt!: Date

  @ApiProperty()
  createdAt!: Date
}
