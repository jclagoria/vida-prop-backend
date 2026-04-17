export interface PaginatedResponseDto<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PaginatedResponse<T> = PaginatedResponseDto<T>
