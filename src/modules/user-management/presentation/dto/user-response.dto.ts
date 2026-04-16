import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'

export class UserResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  email!: string

  @ApiProperty({ enum: UserRole })
  role!: UserRole

  @ApiProperty()
  isActive!: boolean

  @ApiProperty({ required: false })
  name?: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
