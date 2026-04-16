import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import type { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

export interface JwtPayload {
  sub: string
  email: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'default-secret-key',
      ignoreExpiration: false,
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    return new User({
      id: new UserId(payload.sub),
      email: new Email(payload.email),
      passwordHash: '',
      role: payload.role as UserRole,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}
