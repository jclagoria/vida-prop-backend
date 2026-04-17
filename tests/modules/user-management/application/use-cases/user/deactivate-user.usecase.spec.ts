import { of, throwError } from 'rxjs'
import type { IUserServicePort } from '@/modules/user-management/application/ports/i-user.service'
import { DeactivateUserUseCase } from '@/modules/user-management/application/use-cases/user/deactivate-user.usecase'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('DeactivateUserUseCase', () => {
  let useCase: DeactivateUserUseCase
  let mockUserService: IUserServicePort

  const makeUser = () => {
    return new User({
      id: new UserId('user-id'),
      email: new Email('user@habitat.com'),
      passwordHash: 'hashed',
      role: UserRole.TENANT,
      isActive: false,
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

    useCase = new DeactivateUserUseCase(mockUserService)
  })

  describe('execute', () => {
    it('should deactivate user', (done) => {
      const user = makeUser()
      ;(mockUserService.deactivate as jest.Mock).mockReturnValue(of(user))

      useCase.execute('user-id').subscribe((result) => {
        expect(result.isActiveUser()).toBe(false)
        expect(mockUserService.deactivate).toHaveBeenCalledWith('user-id')
        done()
      })
    })

    it('should throw error when service fails', (done) => {
      ;(mockUserService.deactivate as jest.Mock).mockReturnValue(
        throwError(() => new Error('User not found'))
      )

      useCase.execute('user-id').subscribe({
        error: (error) => {
          expect(error.message).toBe('User not found')
          done()
        },
      })
    })
  })
})
