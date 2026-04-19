import { HttpException, HttpStatus } from '@nestjs/common'

export class ThrottlerException extends HttpException {
  constructor(retryAfter: number, limit: number) {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        error: 'Too Many Requests',
        retryAfter,
        limit,
        remaining: 0,
      },
      HttpStatus.TOO_MANY_REQUESTS
    )
  }
}
