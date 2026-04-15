import { Injectable } from '@nestjs/common'
import { from, type Observable } from 'rxjs'
import { catchError, map, shareReplay } from 'rxjs/operators'

export interface EmailOptions {
  to: string
  subject: string
  body: string
  html?: string
}

export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

@Injectable()
export class EmailService {
  send(options: EmailOptions): Observable<SendEmailResult> {
    return from(
      Promise.resolve({
        success: true,
        messageId: `mock-${Date.now()}`,
      })
    ).pipe(
      map((result) => result as SendEmailResult),
      shareReplay(1),
      catchError((error: Error) => {
        throw error
      })
    )
  }

  sendInvitationEmail(
    to: string,
    inviterName: string,
    role: string,
    token: string
  ): Observable<SendEmailResult> {
    return this.send({
      to,
      subject: `You're invited to join as ${role}`,
      body: `${inviterName} has invited you to join as ${role}. Use token: ${token}`,
      html: `<p>${inviterName} has invited you to join as ${role}.</p><p>Token: ${token}</p>`,
    })
  }

  sendWelcomeEmail(to: string, name: string): Observable<SendEmailResult> {
    return this.send({
      to,
      subject: 'Welcome to Habitat',
      body: `Welcome ${name}! Your account has been created.`,
      html: `<p>Welcome ${name}! Your account has been created.</p>`,
    })
  }
}
