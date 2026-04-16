import { Injectable } from '@nestjs/common'
import type { JwtService } from '@nestjs/jwt'
import type { AuthTokens } from '../../application/ports/i-auth.service'
import type { User } from '../../domain/entities/user.entity'

@Injectable()
export class JwtAdapter {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(user: User): AuthTokens {
    const payload = { sub: user.id.toString(), email: user.email.getValue(), role: user.role }

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    }
  }

  refreshToken(refreshToken: string): AuthTokens {
    const payload = this.jwtService.verify(refreshToken)
    return this.generateTokens({
      id: {} as any,
      email: {} as any,
      passwordHash: '',
      role: payload.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User)
  }

  validateToken(token: string): { sub: string; email: string; role: string } | null {
    try {
      return this.jwtService.verify(token)
    } catch {
      return null
    }
  }
}
