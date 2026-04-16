import { Injectable } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'

export interface JwtUser {
  id: string
  email: string
  role: UserRole
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || 'default-secret'
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  async validate(payload: { sub: string; email?: string; role?: string }): Promise<JwtUser> {
    return {
      id: payload.sub,
      email: payload.email || '',
      role: (payload.role as UserRole) || UserRole.TENANT,
    }
  }
}
