import type { ThrottlerModuleOptions } from '@nestjs/throttler'

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      name: 'default',
      ttl: 60000,
      limit: 100,
    },
    {
      name: 'auth',
      ttl: 900000,
      limit: 5,
    },
    {
      name: 'register',
      ttl: 900000,
      limit: 3,
    },
    {
      name: 'refresh',
      ttl: 60000,
      limit: 30,
    },
    {
      name: 'long',
      ttl: 600000,
      limit: 500,
    },
  ],
  errorMessage: 'Too many requests. Please try again later.',
}
