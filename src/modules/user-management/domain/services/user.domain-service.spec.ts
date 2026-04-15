import { of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { User } from '@/modules/user-management/domain/entities/user.entity.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import type { IUserRepository } from '@/modules/user-management/domain/interfaces/i-user.repository.js'
import { UserDomainService } from '@/modules/user-management/domain/services/user.domain-service.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('UserDomainService', () => {
  let userRepository: jest.Mocked<IUserRepository>
  let userService: UserDomainService

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    }
    userService = new UserDomainService(userRepository)
  })

  describe('createUser', () => {
    it('should create user with valid data', (done) => {
      userRepository.findByEmail.mockReturnValue(of(null))
      const savedUser = User.create({
        id: UserId.generate(),
        email: Email.create('test@example.com'),
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      userRepository.save.mockReturnValue(of(savedUser))

      userService
        .createUser({
          email: 'test@example.com',
          password: 'SecurePass123',
          role: UserRole.ADMIN,
        })
        .pipe(tap((user) => expect(user.email.value).toBe('test@example.com')))
        .subscribe({
          next: () => done(),
          error: done.fail,
        })
    })

    it('should throw if email already exists', (done) => {
      const existingUser = User.create({
        id: UserId.generate(),
        email: Email.create('test@example.com'),
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      userRepository.findByEmail.mockReturnValue(of(existingUser))

      userService
        .createUser({
          email: 'test@example.com',
          password: 'SecurePass123',
          role: UserRole.ADMIN,
        })
        .subscribe({
          next: () => done.fail('Should have thrown'),
          error: (err) => {
            expect(err.message).toBe('Email already exists')
            done()
          },
        })
    })

    it('should throw if password invalid', (done) => {
      userService
        .createUser({
          email: 'test@example.com',
          password: 'weak',
          role: UserRole.ADMIN,
        })
        .subscribe({
          next: () => done.fail('Should have thrown'),
          error: (err) => {
            expect(err.message).toContain('Password')
            done()
          },
        })
    })
  })

  describe('deactivateUser', () => {
    it('should deactivate user', (done) => {
      const user = User.create({
        id: UserId.create('123e4567-e89b-12d3-a456-426614174000'),
        email: Email.create('test@example.com'),
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      userRepository.findById.mockReturnValue(of(user))
      userRepository.update.mockReturnValue(of(user))

      userService.deactivateUser(UserId.create('123e4567-e89b-12d3-a456-426614174000')).subscribe({
        next: () => done(),
        error: done.fail,
      })
    })

    it('should throw if user not found', (done) => {
      userRepository.findById.mockReturnValue(of(null))

      userService.deactivateUser(UserId.create('123e4567-e89b-12d3-a456-426614174000')).subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('User not found')
          done()
        },
      })
    })
  })

  describe('canInvite', () => {
    it('should allow admin to invite any role', () => {
      const admin = User.create({
        id: UserId.generate(),
        email: Email.create('admin@example.com'),
        passwordHash: 'hash',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      expect(userService.canInvite(admin, UserRole.TENANT)).toBe(true)
      expect(userService.canInvite(admin, UserRole.ADMIN)).toBe(true)
    })

    it('should allow owner to invite only tenants', () => {
      const owner = User.create({
        id: UserId.generate(),
        email: Email.create('owner@example.com'),
        passwordHash: 'hash',
        role: UserRole.OWNER,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      expect(userService.canInvite(owner, UserRole.TENANT)).toBe(true)
      expect(userService.canInvite(owner, UserRole.ADMIN)).toBe(false)
      expect(userService.canInvite(owner, UserRole.OWNER)).toBe(false)
    })

    it('should not allow tenant to invite anyone', () => {
      const tenant = User.create({
        id: UserId.generate(),
        email: Email.create('tenant@example.com'),
        passwordHash: 'hash',
        role: UserRole.TENANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      expect(userService.canInvite(tenant, UserRole.TENANT)).toBe(false)
    })
  })
})
