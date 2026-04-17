import { AuthRefreshDto } from '@/modules/user-management/presentation/dto/auth-refresh.dto'

describe('AuthRefreshDto', () => {
  it('should have refreshToken property', () => {
    const dto = new AuthRefreshDto()
    dto.refreshToken = 'refresh-token-123'
    expect(dto.refreshToken).toBe('refresh-token-123')
  })
})
