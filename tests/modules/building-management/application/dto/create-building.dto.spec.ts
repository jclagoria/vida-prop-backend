import { CreateBuildingDto } from '@/modules/building-management/application/dto/create-building.dto'
import { Country } from '@/modules/building-management/domain/enums/country.enum'

describe('CreateBuildingDto', () => {
  it('should create instance with required fields', () => {
    const dto = new CreateBuildingDto()
    dto.name = 'Test Building'
    dto.address = 'Test Street 123'
    dto.city = 'Buenos Aires'
    dto.country = Country.ARGENTINA
    dto.code = 'BLD001'

    expect(dto.name).toBe('Test Building')
    expect(dto.address).toBe('Test Street 123')
    expect(dto.city).toBe('Buenos Aires')
    expect(dto.country).toBe(Country.ARGENTINA)
    expect(dto.code).toBe('BLD001')
  })

  it('should allow optional notes field', () => {
    const dto = new CreateBuildingDto()
    dto.name = 'Test Building'
    dto.address = 'Test Street 123'
    dto.city = 'Buenos Aires'
    dto.country = Country.ARGENTINA
    dto.code = 'BLD001'
    dto.notes = 'Test notes'

    expect(dto.notes).toBe('Test notes')
  })

  it('should allow undefined notes', () => {
    const dto = new CreateBuildingDto()
    dto.name = 'Test Building'
    dto.address = 'Test Street 123'
    dto.city = 'Buenos Aires'
    dto.country = Country.ARGENTINA
    dto.code = 'BLD001'

    expect(dto.notes).toBeUndefined()
  })
})
