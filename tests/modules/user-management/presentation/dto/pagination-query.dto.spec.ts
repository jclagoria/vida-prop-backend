import { PaginationQueryDto } from '@/modules/user-management/presentation/dto/pagination-query.dto'

describe('PaginationQueryDto', () => {
  it('should have default page value', () => {
    const dto = new PaginationQueryDto()
    expect(dto.page).toBe(1)
  })

  it('should have default limit value', () => {
    const dto = new PaginationQueryDto()
    expect(dto.limit).toBe(20)
  })

  it('should accept custom page', () => {
    const dto = new PaginationQueryDto()
    dto.page = 5
    expect(dto.page).toBe(5)
  })

  it('should accept custom limit', () => {
    const dto = new PaginationQueryDto()
    dto.limit = 50
    expect(dto.limit).toBe(50)
  })
})
