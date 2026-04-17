import { of } from 'rxjs'
import type { IUserServicePort } from '@/modules/user-management/application/ports/i-user.service'
import { GetUserByIdUseCase } from '@/modules/user-management/application/use-cases/user/get-user-by-id.usecase'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase
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

    useCase = new GetUserByIdUseCase(mockUserService)
  })

  describe('execute', () => {
    it('should return user when found', (done) => {
      const user = makeUser()
      ;(mockUserService.findById as jest.Mock).mockReturnValue(of(user))

      useCase.execute('user-id').subscribe((result) => {
        expect(result).not.toBeNull()
        expect(result?.id.toString()).toBe('user-id')
        done()
      })
    })

    it('should return null when user not found', (done) => {
      ;(mockUserService.findById as jest.Mock).mockReturnValue(of(null))

      useCase.execute('non-existent-id').subscribe((result) => {
        expect(result).toBeNull()
        done()
      })
    })
  })
})
