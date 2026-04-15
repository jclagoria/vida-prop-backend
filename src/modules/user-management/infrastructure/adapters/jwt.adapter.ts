import { Injectable } from '@nestjs/common'
import { sign, verify } from 'jsonwebtoken'
import { from, type Observable } from 'rxjs'
import { catchError, map, shareReplay } from 'rxjs/operators'

export interface JwtPayloadContent {
  sub: string
  email?: string
  role?: string
  iat?: number
  exp?: number
}

@Injectable()
export class JwtAdapter {
  generateAccessToken(
    payload: Omit<JwtPayloadContent, 'iat' | 'exp'>,
    secret: string
  ): Observable<string> {
    return from(
      sign(payload, secret, {
        expiresIn: '15m',
      })
    ).pipe(shareReplay(1))
  }

  generateRefreshToken(payload: { sub: string }, secret: string): Observable<string> {
    return from(
      sign(payload, secret, {
        expiresIn: '7d',
      })
    ).pipe(shareReplay(1))
  }

  verifyAccessToken(token: string, secret: string): Observable<JwtPayloadContent> {
    return from(
      new Promise<JwtPayloadContent>((resolve, reject) => {
        try {
          const decoded = verify(token, secret) as JwtPayloadContent
          resolve(decoded)
        } catch (error) {
          reject(error)
        }
      })
    ).pipe(shareReplay(1))
  }

  verifyRefreshToken(token: string, secret: string): Observable<JwtPayloadContent> {
    return from(
      new Promise<JwtPayloadContent>((resolve, reject) => {
        try {
          const decoded = verify(token, secret) as JwtPayloadContent
          resolve(decoded)
        } catch (error) {
          reject(error)
        }
      })
    ).pipe(shareReplay(1))
  }

  decodeToken(token: string): Observable<JwtPayloadContent | null> {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        return from(Promise.resolve(null))
      }
      const base64Url = parts[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8')
      const decoded = JSON.parse(jsonPayload) as JwtPayloadContent
      return from(Promise.resolve(decoded))
    } catch {
      return from(Promise.resolve(null))
    }
  }
}
