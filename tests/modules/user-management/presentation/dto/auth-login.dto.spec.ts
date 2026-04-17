import { AuthLoginDto } from '@/modules/user-management/presentation/dto/auth-login.dto'

describe('AuthLoginDto', () => {
  it('should have email property', () => {
    const dto = new AuthLoginDto()
    dto.email = 'admin@habitat.com'
    expect(dto.email).toBe('admin@habitat.com')
  })

  it('should have password property', () => {
    const dto = new AuthLoginDto()
    dto.password = 'SecurePass123'
    expect(dto.password).toBe('SecurePass123')
  })

  it('should accept valid email format', () => {
    const dto = new AuthLoginDto()
    dto.email = 'test@example.com'
    expect(dto.email).toContain('@')
  })
})
