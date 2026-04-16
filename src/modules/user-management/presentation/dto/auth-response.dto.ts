import { ApiProperty } from '@nestjs/swagger'

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string

  @ApiProperty()
  refreshToken!: string

  @ApiProperty({ description: 'Expires in seconds (900 = 15 minutes)' })
  expiresIn!: number
}
