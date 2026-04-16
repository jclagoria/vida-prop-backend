import * as crypto from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { from, type Observable } from 'rxjs'

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly key: Buffer

  constructor() {
    const key = process.env.ENCRYPTION_KEY
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable is required')
    }
    this.key = Buffer.from(key, 'base64')
    if (this.key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 bytes (base64 encoded)')
    }
  }

  encrypt(plaintext: string): Observable<string> {
    return from(this.encryptAsync(plaintext))
  }

  decrypt(ciphertext: string): Observable<string> {
    return from(this.decryptAsync(ciphertext))
  }

  private encryptAsync(plaintext: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)
        let encrypted = cipher.update(plaintext, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        const authTag = cipher.getAuthTag()
        resolve(`${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`)
      } catch (error) {
        reject(error)
      }
    })
  }

  private decryptAsync(ciphertext: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const parts = ciphertext.split(':')
        if (parts.length !== 3) {
          throw new Error('Invalid ciphertext format')
        }
        const iv = Buffer.from(parts[0], 'hex')
        const authTag = Buffer.from(parts[1], 'hex')
        const encrypted = parts[2]
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv)
        decipher.setAuthTag(authTag)
        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        resolve(decrypted)
      } catch (error) {
        reject(error)
      }
    })
  }
}
