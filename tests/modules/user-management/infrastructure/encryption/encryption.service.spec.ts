import * as crypto from 'node:crypto'

const algorithm = 'aes-256-gcm'

function createKey(): Buffer {
  return Buffer.alloc(32)
}

function encrypt(plaintext: string, key: Buffer): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

function decrypt(ciphertext: string, key: Buffer): string {
  const parts = ciphertext.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid ciphertext format')
  }
  const iv = Buffer.from(parts[0], 'hex')
  const authTag = Buffer.from(parts[1], 'hex')
  const encrypted = parts[2]
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  decipher.setAuthTag(authTag)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

describe('EncryptionService (unit)', () => {
  const key = createKey()

  describe('encrypt', () => {
    it('should encrypt plaintext', () => {
      const encrypted = encrypt('sensitive data', key)
      expect(encrypted).not.toBe('sensitive data')
      expect(encrypted).toContain(':')
    })

    it('should produce different ciphertext each time', () => {
      const encrypted1 = encrypt('sensitive data', key)
      const encrypted2 = encrypt('sensitive data', key)
      expect(encrypted1).not.toBe(encrypted2)
    })
  })

  describe('decrypt', () => {
    it('should decrypt ciphertext', () => {
      const plaintext = 'sensitive data'
      const encrypted = encrypt(plaintext, key)
      const decrypted = decrypt(encrypted, key)
      expect(decrypted).toBe(plaintext)
    })

    it('should throw error for invalid format', () => {
      expect(() => decrypt('invalid', key)).toThrow('Invalid ciphertext format')
    })
  })
})
