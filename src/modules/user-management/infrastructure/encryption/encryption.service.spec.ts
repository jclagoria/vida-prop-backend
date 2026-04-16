import { EncryptionService } from './encryption.service'

describe('EncryptionService', () => {
  let service: EncryptionService

  beforeEach(() => {
    service = new EncryptionService()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('encrypt', () => {
    it('should encrypt plaintext', async () => {
      const ciphertext = await service.encrypt('hello').toPromise()
      expect(ciphertext).toBeDefined()
      expect(ciphertext).not.toBe('hello')
    })
  })

  describe('decrypt', () => {
    it('should correctly decrypt with roundtrip', async () => {
      const plaintext = 'sensitive-data'
      const ciphertext = await service.encrypt(plaintext).toPromise()
      const result = await service.decrypt(ciphertext!).toPromise()
      expect(result).toBe(plaintext)
    })
  })
})
