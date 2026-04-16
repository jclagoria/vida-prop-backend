import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'

@Injectable()
export class BcryptAdapter {
  private readonly costFactor = 10

  hash(password: string): string {
    return bcrypt.hashSync(password, this.costFactor)
  }

  compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
  }
}
