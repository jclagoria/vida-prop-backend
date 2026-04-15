import { of } from 'rxjs'
import type { IAuthServicePort } from '@/modules/user-management/application/ports/i-auth.service.js'
import { LogoutUseCase } from '@/modules/user-management/application/use-cases/auth/logout.usecase.js'

describe('LogoutUseCase', () => {
  let authService: jest.Mocked<IAuthServicePort>
  let useCase: LogoutUseCase

  beforeEach(() => {
    authService = {
      validateCredentials: jest.fn(),
      generateTokens: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    }
    useCase = new LogoutUseCase(authService)
  })

  describe('execute', () => {
    it('should return undefined if refreshToken is empty', (done) => {
      useCase.execute('').subscribe({
        next: (result) => {
          expect(result).toBeUndefined()
          expect(authService.logout).not.toHaveBeenCalled()
          done()
        },
        error: done.fail,
      })
    })

    it('should call logout service', (done) => {
      authService.logout.mockReturnValue(of(undefined))

      useCase.execute('refresh-token').subscribe({
        next: () => {
          expect(authService.logout).toHaveBeenCalledWith('refresh-token')
          done()
        },
        error: done.fail,
      })
    })
  })
})
