import { Test, type TestingModule } from '@nestjs/testing'
import { from, toArray } from 'rxjs'
import { BcryptAdapter } from './bcrypt.adapter'

describe('BcryptAdapter', () => {
  let adapter: BcryptAdapter

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptAdapter],
    }).compile()

    adapter = module.get<BcryptAdapter>(BcryptAdapter)
  })

  describe('hash', () => {
    it('should hash password', (done) => {
      adapter
        .hash('SecurePass123')
        .pipe(toArray())
        .subscribe({
          next: (hashes) => {
            expect(hashes[0]).toBeDefined()
            expect(hashes[0]).not.toBe('SecurePass123')
            expect(hashes[0].length).toBeGreaterThan(50)
            done()
          },
          error: done.fail,
        })
    })

    it('should produce different hashes for same password', (done) => {
      const password = 'SecurePass123'
      adapter
        .hash(password)
        .pipe(toArray())
        .subscribe({
          next: (hashes) => {
            expect(hashes[0]).not.toBe(password)
            done()
          },
          error: done.fail,
        })
    })
  })

  describe('compare', () => {
    it('should return true for correct password', async () => {
      const password = 'SecurePass123'
      const hashed = await adapter.hash(password).toPromise()

      const result = await adapter.compare(password, hashed!).toPromise()
      expect(result).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      const password = 'SecurePass123'
      const hashed = await adapter.hash(password).toPromise()

      const result = await adapter.compare('WrongPassword', hashed!).toPromise()
      expect(result).toBe(false)
    })
  })
})
