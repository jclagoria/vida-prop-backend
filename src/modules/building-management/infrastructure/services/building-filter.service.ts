import { Injectable } from '@nestjs/common'
import type { BuildingFilterDto } from '@/modules/building-management/application/dto/building-filter.dto'
import type { Building } from '@/modules/building-management/domain/entities/building.entity'
import type { PaginatedResponse } from '@/modules/building-management/presentation/dto/paginated-response.dto'

export interface PaginatedResult<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

@Injectable()
export class BuildingFilterService {
  filterBuildings(buildings: Building[], filter: BuildingFilterDto): Building[] {
    let result = buildings

    if (filter.country) {
      result = result.filter((b) => b.country === filter.country)
    }

    if (filter.city) {
      const cityLower = filter.city.toLowerCase()
      result = result.filter((b) => b.city.toLowerCase().includes(cityLower))
    }

    if (filter.name) {
      const nameLower = filter.name.toLowerCase()
      result = result.filter((b) => b.name.toLowerCase().includes(nameLower))
    }

    return result
  }

  paginate<T>(items: T[], page = 1, limit = 20): PaginatedResult<T> {
    const start = (page - 1) * limit
    const end = start + limit

    return {
      data: items.slice(start, end),
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    }
  }
}
