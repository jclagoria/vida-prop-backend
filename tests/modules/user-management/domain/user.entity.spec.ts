import { User } from '@/modules/user-management/domain/entities/user.entity'
import { UserRole } from '@/modules/user-management/domain/enums/user-role.enum'
import { Email } from '@/modules/user-management/domain/value-objects/email.value-object'
import { UserId } from '@/modules/user-management/domain/value-objects/user-id.value-object'

describe('User Entity', () => {
  const makeUser = (props?: {
    id?: string
    email?: string
    role?: UserRole
    isActive?: boolean
  }) => {
    return new User({
      id: new UserId(props?.id ?? 'test-uuid'),
      email: new Email(props?.email ?? 'test@habitat.com'),
      passwordHash: 'hashed_password',
      role: props?.role ?? UserRole.ADMIN,
      isActive: props?.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  it('should create user with all required fields', () => {
    const user = makeUser()
    expect(user.id.toString()).toBe('test-uuid')
    expect(user.email.getValue()).toBe('test@habitat.com')
    expect(user.role).toBe(UserRole.ADMIN)
    expect(user.isActive).toBe(true)
  })

  it('isAdmin returns true for admin role', () => {
    expect(makeUser({ role: UserRole.ADMIN }).isAdmin()).toBe(true)
  })

  it('isAdmin returns false for non-admin role', () => {
    expect(makeUser({ role: UserRole.TENANT }).isAdmin()).toBe(false)
  })

  it('isActiveUser returns true when active', () => {
    expect(makeUser({ isActive: true }).isActiveUser()).toBe(true)
  })

  it('isActiveUser returns false when inactive', () => {
    expect(makeUser({ isActive: false }).isActiveUser()).toBe(false)
  })

  it('deactivate creates new inactive user', () => {
    const user = makeUser({ isActive: true })
    const deactivated = user.deactivate()
    expect(deactivated.isActive).toBe(false)
    expect(user.isActive).toBe(true)
  })

  it('activate creates new active user', () => {
    const user = makeUser({ isActive: false })
    const activated = user.activate()
    expect(activated.isActive).toBe(true)
    expect(user.isActive).toBe(false)
  })

  it('equals returns true for same id', () => {
    const user1 = makeUser({ id: 'same' })
    const user2 = makeUser({ id: 'same' })
    expect(user1.equals(user2)).toBe(true)
  })

  it('equals returns false for different id', () => {
    const user1 = makeUser({ id: 'uuid1' })
    const user2 = makeUser({ id: 'uuid2' })
    expect(user1.equals(user2)).toBe(false)
  })
})
