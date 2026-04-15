import { of, throwError } from 'rxjs'
import type { IAuthServicePort } from '@/modules/user-management/application/ports/i-auth.service.js'
import { RefreshTokenUseCase } from '@/modules/user-management/application/use-cases/auth/refresh-token.usecase.js'

describe('RefreshTokenUseCase', () => {
  let authService: jest.Mocked<IAuthServicePort>
  let useCase: RefreshTokenUseCase

  beforeEach(() => {
    authService = {
      validateCredentials: jest.fn(),
      generateTokens: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    }
    useCase = new RefreshTokenUseCase(authService)
  })

  describe('execute', () => {
    it('should throw if refreshToken is missing', (done) => {
      useCase.execute('').subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Refresh token is required')
          done()
        },
      })
    })

    it('should return tokens on success', (done) => {
      authService.refreshToken.mockReturnValue(
        of({ accessToken: 'new-access-token', refreshToken: 'new-refresh-token' })
      )

      useCase.execute('old-refresh-token').subscribe({
        next: (result) => {
          expect(result.accessToken).toBe('new-access-token')
          expect(result.refreshToken).toBe('new-refresh-token')
          done()
        },
        error: done.fail,
      })
    })
  })
})
