import { of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Invitation } from '@/modules/user-management/domain/entities/invitation.entity.js'
import { User } from '@/modules/user-management/domain/entities/user.entity.js'
import { InvitationStatus } from '@/modules/user-management/domain/enums/invitation-status.enum.js'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum.js'
import type { IInvitationRepository } from '@/modules/user-management/domain/interfaces/i-invitation.repository.js'
import { InvitationDomainService } from '@/modules/user-management/domain/services/invitation.domain-service.js'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object.js'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object.js'

describe('InvitationDomainService', () => {
  let invitationRepository: jest.Mocked<IInvitationRepository>
  let invitationService: InvitationDomainService

  beforeEach(() => {
    invitationRepository = {
      findById: jest.fn(),
      findByToken: jest.fn(),
      findByEmail: jest.fn(),
      findByCreator: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteExpired: jest.fn(),
    }
    invitationService = new InvitationDomainService(invitationRepository)
  })

  describe('createInvitation', () => {
    it('should create invitation with valid data', (done) => {
      invitationRepository.findByEmail.mockReturnValue(of(null))
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const invitation = Invitation.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: Email.create('test@example.com'),
        role: UserRole.TENANT,
        token: 'token-123',
        status: InvitationStatus.PENDING,
        expiresAt: futureDate,
        createdById: UserId.generate(),
        createdAt: new Date(),
      })
      invitationRepository.save.mockReturnValue(of(invitation))

      invitationService
        .createInvitation({
          email: 'test@example.com',
          role: UserRole.TENANT,
          createdById: UserId.generate(),
        })
        .pipe(tap((inv) => expect(inv.email.value).toBe('test@example.com')))
        .subscribe({
          next: () => done(),
          error: done.fail,
        })
    })

    it('should throw if pending invitation exists for email', (done) => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const existing = Invitation.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: Email.create('test@example.com'),
        role: UserRole.TENANT,
        token: 'existing-token',
        status: InvitationStatus.PENDING,
        expiresAt: futureDate,
        createdById: UserId.generate(),
        createdAt: new Date(),
      })
      invitationRepository.findByEmail.mockReturnValue(of(existing))

      invitationService
        .createInvitation({
          email: 'test@example.com',
          role: UserRole.TENANT,
          createdById: UserId.generate(),
        })
        .subscribe({
          next: () => done.fail('Should have thrown'),
          error: (err) => {
            expect(err.message).toBe('Pending invitation already exists for this email')
            done()
          },
        })
    })
  })

  describe('acceptInvitation', () => {
    it('should accept valid invitation', (done) => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const invitation = Invitation.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: Email.create('test@example.com'),
        role: UserRole.TENANT,
        token: 'valid-token',
        status: InvitationStatus.PENDING,
        expiresAt: futureDate,
        createdById: UserId.generate(),
        createdAt: new Date(),
      })
      invitationRepository.findByToken.mockReturnValue(of(invitation))
      invitationRepository.update.mockReturnValue(of(invitation))

      invitationService.acceptInvitation('valid-token').subscribe({
        next: () => done(),
        error: done.fail,
      })
    })

    it('should throw if invitation not found', (done) => {
      invitationRepository.findByToken.mockReturnValue(of(null))

      invitationService.acceptInvitation('invalid-token').subscribe({
        next: () => done.fail('Should have thrown'),
        error: (err) => {
          expect(err.message).toBe('Invitation not found')
          done()
        },
      })
    })
  })

  describe('cancelInvitation', () => {
    it('should cancel pending invitation', (done) => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const invitation = Invitation.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: Email.create('test@example.com'),
        role: UserRole.TENANT,
        token: 'valid-token',
        status: InvitationStatus.PENDING,
        expiresAt: futureDate,
        createdById: UserId.generate(),
        createdAt: new Date(),
      })
      invitationRepository.findById.mockReturnValue(of(invitation))
      invitationRepository.update.mockReturnValue(of(invitation))

      invitationService.cancelInvitation('123e4567-e89b-12d3-a456-426614174000').subscribe({
        next: () => done(),
        error: done.fail,
      })
    })
  })

  describe('cleanupExpired', () => {
    it('should delete expired invitations', (done) => {
      invitationRepository.deleteExpired.mockReturnValue(of(5))

      invitationService.cleanupExpired().subscribe({
        next: (count) => {
          expect(count).toBe(5)
          done()
        },
        error: done.fail,
      })
    })
  })
})
