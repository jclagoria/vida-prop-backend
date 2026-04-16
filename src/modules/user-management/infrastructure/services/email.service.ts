import { Injectable, Logger } from '@nestjs/common'
import { from, type Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'
import { InvitationEmailTemplate } from '@/modules/user-management/infrastructure/templates/invitation-email.template'

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)

  async sendInvitationEmail(invitation: Invitation, inviterName: string): Promise<void> {
    const _html = InvitationEmailTemplate.generate(invitation, inviterName)
    this.logger.log(`Sending invitation email to ${invitation.email}`)
    console.log(`[Email] To: ${invitation.email}`)
    console.log(`[Email] Subject: You have been invited to Habitat`)
    console.log(`[Email] Role: ${invitation.role}`)
    console.log(`[Email] Expires: ${invitation.expiresAt.toLocaleDateString()}`)
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    console.log(`Sending password reset email to ${to} with token ${token}`)
  }
}
