import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { of, throwError } from 'rxjs'
import type { LoginUseCase } from '@/modules/user-management/application/use-cases/auth/login.usecase'
import type { LogoutUseCase } from '@/modules/user-management/application/use-cases/auth/logout.usecase'
import type { RefreshTokenUseCase } from '@/modules/user-management/application/use-cases/auth/refresh-token.usecase'
import { AuthController } from '@/modules/user-management/presentation/controllers/auth.controller'

describe('AuthController', () => {
  let controller: AuthController

  const mockLoginUseCase = { execute: jest.fn() }
  const mockRefreshTokenUseCase = { execute: jest.fn() }
  const mockLogoutUseCase = { execute: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()

    controller = new AuthController(
      mockLoginUseCase as unknown as LoginUseCase,
      mockRefreshTokenUseCase as unknown as RefreshTokenUseCase,
      mockLogoutUseCase as unknown as LogoutUseCase
    )
  })

  describe('login', () => {
    it('should return tokens on successful login', async () => {
      mockLoginUseCase.execute.mockReturnValue(
        of({ accessToken: 'access-token', refreshToken: 'refresh-token' })
      )

      const result = await controller.login({ email: 'test@habitat.com', password: 'password123' })

      expect(result.accessToken).toBe('access-token')
      expect(result.refreshToken).toBe('refresh-token')
      expect(result.expiresIn).toBe(900)
    })

    it('should throw UnauthorizedException on invalid credentials', async () => {
      mockLoginUseCase.execute.mockReturnValue(throwError(() => new Error('Invalid credentials')))

      await expect(
        controller.login({ email: 'test@habitat.com', password: 'wrong' })
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('refresh', () => {
    it('should return new tokens on successful refresh', async () => {
      mockRefreshTokenUseCase.execute.mockReturnValue(
        of({ accessToken: 'new-access-token', refreshToken: 'new-refresh-token' })
      )

      const result = await controller.refresh({ refreshToken: 'old-refresh-token' })

      expect(result.accessToken).toBe('new-access-token')
    })

    it('should throw UnauthorizedException on invalid token', async () => {
      mockRefreshTokenUseCase.execute.mockReturnValue(throwError(() => new Error('Invalid token')))

      await expect(controller.refresh({ refreshToken: 'invalid-token' })).rejects.toThrow(
        UnauthorizedException
      )
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockLogoutUseCase.execute.mockReturnValue(of(undefined))

      await expect(controller.logout({ refreshToken: 'refresh-token' })).resolves.toBeUndefined()
    })

    it('should throw BadRequestException on error', async () => {
      mockLogoutUseCase.execute.mockReturnValue(throwError(() => new Error('Logout failed')))

      await expect(controller.logout({ refreshToken: 'invalid-token' })).rejects.toThrow(
        BadRequestException
      )
    })
  })
})
