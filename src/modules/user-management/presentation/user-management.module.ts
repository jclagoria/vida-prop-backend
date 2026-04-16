import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AUTH_SERVICE_PORT } from '@/modules/user-management/application/ports/i-auth.service'
import { LoginUseCase } from '@/modules/user-management/application/use-cases/auth/login.usecase'
import { LogoutUseCase } from '@/modules/user-management/application/use-cases/auth/logout.usecase'
import { RefreshTokenUseCase } from '@/modules/user-management/application/use-cases/auth/refresh-token.usecase'
import { BcryptAdapter } from '@/modules/user-management/infrastructure/adapters/bcrypt.adapter'
import { JwtAdapter } from '@/modules/user-management/infrastructure/adapters/jwt.adapter'
import { JwtStrategy } from '@/modules/user-management/infrastructure/auth/jwt.strategy'
import { JwtAuthGuard } from '@/modules/user-management/infrastructure/auth/jwt-auth.guard'
import { RolesGuard } from '@/modules/user-management/infrastructure/auth/roles.guard'
import { PrismaUserRepository } from '@/modules/user-management/infrastructure/repositories/prisma-user.repository'
import { AuthService } from '@/modules/user-management/infrastructure/services/auth.service'
import { AuthController } from './controllers/auth.controller'
import { InvitationController } from './controllers/invitation.controller'
import { UserController } from './controllers/user.controller'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController, UserController, InvitationController],
  providers: [
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    JwtAdapter,
    BcryptAdapter,
    {
      provide: 'PrismaService',
      useValue: {},
    },
    {
      provide: 'PrismaUserRepository',
      useFactory: (prisma: any) => new PrismaUserRepository(prisma),
      inject: ['PrismaService'],
    },
    {
      provide: AUTH_SERVICE_PORT,
      useExisting: AuthService,
    },
  ],
  exports: [AuthService],
})
export class UserManagementModule {}
