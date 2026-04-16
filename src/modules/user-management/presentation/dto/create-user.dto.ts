import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'

export class CreateUserDto {
  @ApiProperty({ example: 'user@habitat.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'SecurePass123' })
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  password!: string

  @ApiProperty({ enum: UserRole, example: UserRole.TENANT })
  @IsEnum(UserRole)
  role!: UserRole

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string
}
