import { Injectable } from '@nestjs/common'
import type { JwtService } from '@nestjs/jwt'
import { from, type Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { AuthTokens } from '../../application/ports/i-auth.service'
import { User, type UserProps } from '../../domain/entities/user.entity'
import type { UserRole } from '../../domain/enums/user-role.enum'
import { Email } from '../../domain/value-objects/email.value-object'
import { UserId } from '../../domain/value-objects/user-id.value-object'

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

  verifyAccessToken(token: string): Observable<User> {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string; role: UserRole }>(token)
      return of(
        new User({
          id: new UserId(payload.sub),
          email: new Email(payload.email),
          passwordHash: '',
          role: payload.role,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      )
    } catch (error) {
      return from(Promise.reject(error))
    }
  }

  refreshToken(refreshToken: string): AuthTokens {
    const payload = this.jwtService.verify<{ sub: string; email: string; role: UserRole }>(
      refreshToken
    )
    return this.generateTokens(
      new User({
        id: new UserId(payload.sub),
        email: new Email(payload.email),
        passwordHash: '',
        role: payload.role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    )
  }

  validateToken(token: string): { sub: string; email: string; role: string } | null {
    try {
      return this.jwtService.verify(token)
    } catch {
      return null
    }
  }
}
