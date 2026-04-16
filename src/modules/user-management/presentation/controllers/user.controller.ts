import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { firstValueFrom, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { UpdateUserDto as AppUpdateUserDto } from '@/modules/user-management/application/dto/update-user.dto'
import type { CreateUserUseCase } from '@/modules/user-management/application/use-cases/user/create-user.usecase'
import type { DeactivateUserUseCase } from '@/modules/user-management/application/use-cases/user/deactivate-user.usecase'
import type { GetUserByIdUseCase } from '@/modules/user-management/application/use-cases/user/get-user-by-id.usecase'
import type { UpdateUserUseCase } from '@/modules/user-management/application/use-cases/user/update-user.usecase'
import type { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { CurrentUser } from '@/modules/user-management/infrastructure/auth/decorators/current-user.decorator'
import { Roles } from '@/modules/user-management/infrastructure/auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/user-management/infrastructure/auth/jwt-auth.guard'
import { RolesGuard } from '@/modules/user-management/infrastructure/auth/roles.guard'
import type { CreateUserDto } from '../dto/create-user.dto'
import type { PaginatedResponse, PaginationQueryDto } from '../dto/pagination-query.dto'
import type { UpdateUserDto } from '../dto/update-user.dto'
import { UserResponseDto } from '../dto/user-response.dto'

const mapUserToResponse = (user: User): UserResponseDto => ({
  id: user.id.toString(),
  email: user.email.getValue(),
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List all users with pagination' })
  @ApiResponse({ status: 200, description: 'Users retrieved' })
  async getAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponse<UserResponseDto>> {
    const page = query.page || 1
    const limit = query.limit || 20

    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return firstValueFrom(
      this.createUserUseCase.execute(dto).pipe(
        map((user) => mapUserToResponse(user)),
        catchError((error) => throwError(() => new Error(error.message)))
      )
    )
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.SUPERINTENDENT)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    return firstValueFrom(
      this.getUserByIdUseCase.execute(id).pipe(
        map((user) => mapUserToResponse(user!)),
        catchError((error) => throwError(() => new Error(error.message)))
      )
    )
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserResponseDto> {
    return firstValueFrom(
      this.updateUserUseCase.execute(id, dto as any).pipe(
        map((user) => mapUserToResponse(user!)),
        catchError((error) => throwError(() => new Error(error.message)))
      )
    )
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiResponse({ status: 200, description: 'User deactivated', type: UserResponseDto })
  async deactivate(@Param('id') id: string): Promise<UserResponseDto> {
    return firstValueFrom(
      this.deactivateUserUseCase.execute(id).pipe(
        map((user) => mapUserToResponse(user)),
        catchError((error) => throwError(() => new Error(error.message)))
      )
    )
  }

  @Patch(':id/reactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Reactivate user' })
  @ApiResponse({ status: 200, description: 'User reactivated', type: UserResponseDto })
  async reactivate(@Param('id') id: string): Promise<UserResponseDto> {
    return firstValueFrom(
      this.deactivateUserUseCase.execute(id).pipe(
        map((user) => mapUserToResponse(user)),
        catchError((error) => throwError(() => new Error(error.message)))
      )
    )
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    return undefined
  }
}
