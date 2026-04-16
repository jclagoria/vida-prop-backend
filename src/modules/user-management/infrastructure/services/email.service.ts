import { Injectable } from '@nestjs/common'

@Injectable()
export class EmailService {
  async sendInvitationEmail(to: string, token: string, role: string): Promise<void> {
    console.log(`Sending invitation email to ${to} with token ${token} for role ${role}`)
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    console.log(`Sending password reset email to ${to} with token ${token}`)
  }
}
