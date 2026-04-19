import { ExecutionContext, Injectable } from '@nestjs/common'
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler'
import type { Request } from 'express'

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown'
    const userId = (req as Request & { user?: { id: string } }).user?.id
    return userId ? `user:${userId}` : `ip:${ip}`
  }
}
