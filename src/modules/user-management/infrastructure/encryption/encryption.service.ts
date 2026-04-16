import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { from, type Observable } from 'rxjs'
import { shareReplay } from 'rxjs/operators'

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly keyLength = 32
  private readonly ivLength = 16
  private readonly authTagLength = 16

  private getKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY || 'default-32-char-base64-key!!'
    return Buffer.from(key.padEnd(this.keyLength).slice(0, this.keyLength), 'utf-8')
  }

  encrypt(plaintext: string): Observable<string> {
    return from(this.encryptSync(plaintext)).pipe(shareReplay(1))
  }

  private async encryptSync(plaintext: string): Promise<string> {
    const iv = randomBytes(this.ivLength)
    const key = this.getKey()

    const cipher = createCipheriv(this.algorithm, key, iv)
    let encrypted = cipher.update(plaintext, 'utf-8', 'base64')
    encrypted += cipher.final('base64')
    const authTag = cipher.getAuthTag()

    const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, 'base64')])
    return combined.toString('base64')
  }

  decrypt(ciphertext: string): Observable<string> {
    return from(this.decryptSync(ciphertext)).pipe(shareReplay(1))
  }

  private async decryptSync(ciphertext: string): Promise<string> {
    const key = this.getKey()
    const combined = Buffer.from(ciphertext, 'base64')

    const iv = combined.subarray(0, this.ivLength)
    const authTag = combined.subarray(this.ivLength, this.ivLength + this.authTagLength)
    const encrypted = combined.subarray(this.ivLength + this.authTagLength)

    const decipher = createDecipheriv(this.algorithm, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted as any, 'base64', 'utf-8')
    decrypted += decipher.final('utf-8')

    return decrypted
  }
}
