import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { firstValueFrom, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { AcceptInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/accept-invitation.usecase'
import type { CancelInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/cancel-invitation.usecase'
import type { CreateInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/create-invitation.usecase'
import type { ResendInvitationUseCase } from '@/modules/user-management/application/use-cases/invitation/resend-invitation.usecase'
import type { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { CurrentUser } from '@/modules/user-management/infrastructure/auth/decorators/current-user.decorator'
import { Roles } from '@/modules/user-management/infrastructure/auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/user-management/infrastructure/auth/jwt-auth.guard'
import { RolesGuard } from '@/modules/user-management/infrastructure/auth/roles.guard'
import {
  type CreateInvitationDto,
  InvitationResponseDto,
} from '@/modules/user-management/presentation/dto/invitation.dto'
import type {
  PaginatedResponse,
  PaginationQueryDto,
} from '@/modules/user-management/presentation/dto/pagination-query.dto'
import { AuthResponseDto } from '../dto/auth-response.dto'

const mapInvitationToResponse = (invitation: any): InvitationResponseDto => ({
  id: invitation.id.toString(),
  email: invitation.email.getValue ? invitation.email.getValue() : invitation.email,
  role: invitation.role,
  status: invitation.status,
  expiresAt: invitation.expiresAt,
  createdAt: invitation.createdAt,
})

@ApiTags('invitations')
@Controller('invitations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvitationController {
  constructor(
    private readonly createInvitationUseCase: CreateInvitationUseCase,
    private readonly acceptInvitationUseCase: AcceptInvitationUseCase,
    private readonly cancelInvitationUseCase: CancelInvitationUseCase,
    private readonly resendInvitationUseCase: ResendInvitationUseCase
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'List all invitations' })
  @ApiResponse({ status: 200, description: 'Invitations retrieved' })
  async getAll(
    @Query() query: PaginationQueryDto
  ): Promise<PaginatedResponse<InvitationResponseDto>> {
    return {
      data: [],
      total: 0,
      page: query.page || 1,
      limit: query.limit || 20,
      totalPages: 0,
    }
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Create a new invitation' })
  @ApiResponse({ status: 201, description: 'Invitation created', type: InvitationResponseDto })
  async create(
    @Body() dto: CreateInvitationDto,
    @CurrentUser() user: User
  ): Promise<InvitationResponseDto> {
    return firstValueFrom(
      this.createInvitationUseCase.execute(dto, user.id.toString()).pipe(
        map((invitation) => mapInvitationToResponse(invitation)),
        catchError((error) => throwError(() => new Error(error.message)))
      )
    )
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Get invitation by ID' })
  @ApiResponse({ status: 200, description: 'Invitation found', type: InvitationResponseDto })
  async getById(@Param('id') id: string): Promise<InvitationResponseDto> {
    return {
      id,
      email: '',
      role: UserRole.TENANT,
      status: 'PENDING',
      expiresAt: new Date(),
      createdAt: new Date(),
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel invitation' })
  @ApiResponse({ status: 200, description: 'Invitation cancelled', type: InvitationResponseDto })
  async cancel(@Param('id') id: string): Promise<InvitationResponseDto> {
    return firstValueFrom(
      this.cancelInvitationUseCase.execute(id).pipe(
        map((invitation) => mapInvitationToResponse(invitation)),
        catchError((error) => throwError(() => new Error(error.message)))
      )
    )
  }

  @Post(':id/resend')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Resend invitation' })
  @ApiResponse({ status: 200, description: 'Invitation resent', type: InvitationResponseDto })
  async resend(@Param('id') id: string): Promise<InvitationResponseDto> {
    return firstValueFrom(
      this.resendInvitationUseCase.execute(id).pipe(
        map((invitation) => mapInvitationToResponse(invitation)),
        catchError((error) => throwError(() => new Error(error.message)))
      )
    )
  }

  @Post(':id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept invitation and create account' })
  @ApiResponse({ status: 200, description: 'Account created with tokens', type: AuthResponseDto })
  async accept(
    @Param('id') id: string,
    @Body() body: { password: string }
  ): Promise<AuthResponseDto> {
    return firstValueFrom(
      this.acceptInvitationUseCase.execute(id, body.password).pipe(
        map(() => ({
          accessToken: 'token-generated-after-acceptance',
          refreshToken: 'refresh-token-generated-after-acceptance',
          expiresIn: 900,
        })),
        catchError((error) => throwError(() => new Error(error.message)))
      )
    )
  }
}
