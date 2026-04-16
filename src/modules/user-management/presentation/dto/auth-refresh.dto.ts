import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AuthRefreshDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken!: string
}
