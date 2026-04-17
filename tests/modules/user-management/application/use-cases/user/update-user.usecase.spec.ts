import { of, throwError } from 'rxjs'
import type { UpdateUserDto } from '@/modules/user-management/application/dto/update-user.dto'
import type { IUserServicePort } from '@/modules/user-management/application/ports/i-user.service'
import { UpdateUserUseCase } from '@/modules/user-management/application/use-cases/user/update-user.usecase'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase
  let mockUserService: IUserServicePort

  const makeUser = () => {
    return new User({
      id: new UserId('user-id'),
      email: new Email('user@habitat.com'),
      passwordHash: 'hashed',
      role: UserRole.TENANT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  beforeEach(() => {
    mockUserService = {
      create: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as never

    useCase = new UpdateUserUseCase(mockUserService)
  })

  describe('execute', () => {
    it('should update user email', (done) => {
      const user = new User({
        id: new UserId('user-id'),
        email: new Email('newemail@habitat.com'),
        passwordHash: 'hashed',
        role: UserRole.TENANT,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ;(mockUserService.update as jest.Mock).mockReturnValue(of(user))

      const dto: UpdateUserDto = { email: 'newemail@habitat.com' }

      useCase.execute('user-id', dto).subscribe((result) => {
        expect(result.email.getValue()).toBe('newemail@habitat.com')
        expect(mockUserService.update).toHaveBeenCalledWith('user-id', dto)
        done()
      })
    })

    it('should throw error when service fails', (done) => {
      ;(mockUserService.update as jest.Mock).mockReturnValue(
        throwError(() => new Error('User not found'))
      )

      const dto: UpdateUserDto = { email: 'newemail@habitat.com' }

      useCase.execute('user-id', dto).subscribe({
        error: (error) => {
          expect(error.message).toBe('User not found')
          done()
        },
      })
    })

    it('should update password', (done) => {
      const user = makeUser()
      ;(mockUserService.update as jest.Mock).mockReturnValue(of(user))

      const dto: UpdateUserDto = { password: 'NewPass123!' }

      useCase.execute('user-id', dto).subscribe((result) => {
        expect(result).toBe(user)
        done()
      })
    })
  })
})
