import { of, throwError } from 'rxjs'
import { CreateUserUseCase } from '@/modules/user-management/application/use-cases/user/create-user.usecase'
import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { UserDomainService } from '@/modules/user-management/domain/services/user.domain-service'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
  let mockUserService: { create: jest.Mock }
  let mockDomainService: { validateUserCreation: jest.Mock }

  const makeUser = () => {
    return new User({
      id: new UserId('new-user-id'),
      email: new Email('new@habitat.com'),
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
    }

    mockDomainService = {
      validateUserCreation: jest.fn(),
    }

    useCase = new CreateUserUseCase(mockUserService as never, mockDomainService as never)
  })

  describe('execute', () => {
    it('should create user with valid input', (done) => {
      const user = makeUser()
      mockDomainService.validateUserCreation.mockReturnValue({
        valid: true,
        errors: [],
      })
      mockUserService.create.mockReturnValue(of(user))

      const dto = {
        email: 'new@habitat.com',
        password: 'ValidPass123!',
        role: UserRole.TENANT,
      }

      useCase.execute(dto).subscribe((result) => {
        expect(result).toBe(user)
        done()
      })
    })

    it('should throw error when validation fails', (done) => {
      mockDomainService.validateUserCreation.mockReturnValue({
        valid: false,
        errors: ['Invalid email format'],
      })

      const dto = {
        email: 'invalid-email',
        password: 'weak',
        role: UserRole.TENANT,
      }

      useCase.execute(dto).subscribe({
        error: (error) => {
          expect(error.message).toContain('Invalid email format')
          done()
        },
      })
    })

    it('should throw error when service fails', (done) => {
      mockDomainService.validateUserCreation.mockReturnValue({
        valid: true,
        errors: [],
      })
      mockUserService.create.mockReturnValue(throwError(() => new Error('Database error')))

      const dto = {
        email: 'new@habitat.com',
        password: 'ValidPass123!',
        role: UserRole.TENANT,
      }

      useCase.execute(dto).subscribe({
        error: (error) => {
          expect(error.message).toBe('Database error')
          done()
        },
      })
    })
  })
})
