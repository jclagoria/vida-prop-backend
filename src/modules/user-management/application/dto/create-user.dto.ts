import { IsEmail, IsString, Matches, MinLength } from 'class-validator'
import type { UserRole } from '../../domain/enums/user-role.enum'

export class CreateUserDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  password!: string

  role!: UserRole
}
