import { Test, type TestingModule } from '@nestjs/testing'
import { of, throwError } from 'rxjs'
import type { IAuthServicePort } from '@/modules/user-management/application/ports/i-auth.service'
import { LogoutUseCase } from '@/modules/user-management/application/use-cases/auth/logout.usecase'
import { RefreshTokenUseCase } from '@/modules/user-management/application/use-cases/auth/refresh-token.usecase'

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase
  let mockAuthService: { logout: jest.Mock }

  beforeEach(() => {
    mockAuthService = {
      logout: jest.fn().mockReturnValue(of(undefined)),
    }

    useCase = new LogoutUseCase(mockAuthService as never)
  })

  describe('execute', () => {
    it('should logout successfully', (done) => {
      useCase.execute('refresh-token').subscribe((result) => {
        expect(result).toBeUndefined()
        expect(mockAuthService.logout).toHaveBeenCalledWith('refresh-token')
        done()
      })
    })

    it('should throw error on logout failure', (done) => {
      mockAuthService.logout.mockReturnValue(throwError(() => new Error('Logout failed')))

      useCase.execute('invalid-token').subscribe({
        error: (error) => {
          expect(error.message).toContain('Logout failed')
          done()
        },
      })
    })
  })
})

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase
  let mockAuthService: { refreshToken: jest.Mock }

  const makeTokens = () => ({
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
  })

  beforeEach(() => {
    mockAuthService = {
      refreshToken: jest.fn(),
    }

    useCase = new RefreshTokenUseCase(mockAuthService as never)
  })

  describe('execute', () => {
    it('should refresh token successfully', (done) => {
      mockAuthService.refreshToken.mockReturnValue(of(makeTokens()))

      useCase.execute('valid-refresh-token').subscribe((tokens) => {
        expect(tokens.accessToken).toBe('new-access-token')
        expect(mockAuthService.refreshToken).toHaveBeenCalledWith('valid-refresh-token')
        done()
      })
    })

    it('should throw error on invalid token', (done) => {
      mockAuthService.refreshToken.mockReturnValue(throwError(() => new Error('Invalid token')))

      useCase.execute('invalid-token').subscribe({
        error: (error) => {
          expect(error.message).toContain('Invalid token')
          done()
        },
      })
    })

    it('should propagate service error with message', (done) => {
      mockAuthService.refreshToken.mockReturnValue(throwError(() => new Error('Token expired')))

      useCase.execute('expired-token').subscribe({
        error: (error) => {
          expect(error.message).toContain('Token expired')
          done()
        },
      })
    })

    it('should return new tokens on refresh success', (done) => {
      mockAuthService.refreshToken.mockReturnValue(
        of({
          accessToken: 'another-access',
          refreshToken: 'another-refresh',
        })
      )

      useCase.execute('old-token').subscribe((result) => {
        expect(result.accessToken).toBe('another-access')
        done()
      })
    })
  })
})
