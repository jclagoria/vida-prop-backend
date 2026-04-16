import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { firstValueFrom, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { LoginUseCase } from '@/modules/user-management/application/use-cases/auth/login.usecase'
import type { LogoutUseCase } from '@/modules/user-management/application/use-cases/auth/logout.usecase'
import type { RefreshTokenUseCase } from '@/modules/user-management/application/use-cases/auth/refresh-token.usecase'
import { JwtAuthGuard } from '@/modules/user-management/infrastructure/auth/jwt-auth.guard'
import type { AuthLoginDto } from '../dto/auth-login.dto'
import type { AuthRefreshDto } from '../dto/auth-refresh.dto'
import { AuthResponseDto } from '../dto/auth-response.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthLoginDto): Promise<AuthResponseDto> {
    return firstValueFrom(
      this.loginUseCase.execute(dto.email, dto.password).pipe(
        map((tokens) => ({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: 900,
        })),
        catchError((error) => throwError(() => new UnauthorizedException(error.message)))
      )
    )
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: AuthRefreshDto): Promise<AuthResponseDto> {
    return firstValueFrom(
      this.refreshTokenUseCase.execute(dto.refreshToken).pipe(
        map((tokens) => ({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: 900,
        })),
        catchError((error) => throwError(() => new UnauthorizedException(error.message)))
      )
    )
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiResponse({ status: 204, description: 'Logout successful' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() dto: AuthRefreshDto): Promise<void> {
    return firstValueFrom(
      this.logoutUseCase
        .execute(dto.refreshToken)
        .pipe(catchError((error) => throwError(() => new BadRequestException(error.message))))
    )
  }
}
