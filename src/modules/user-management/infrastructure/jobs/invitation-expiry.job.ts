import { Injectable, Logger, type OnModuleInit } from '@nestjs/common'
import { defer, firstValueFrom } from 'rxjs'
import type { IInvitationRepository } from '@/modules/user-management/domain/interfaces/i-invitation.repository'

@Injectable()
export class InvitationExpiryJob implements OnModuleInit {
  private readonly logger = new Logger(InvitationExpiryJob.name)
  private intervalId: NodeJS.Timeout | null = null

  constructor(private readonly invitationRepository: IInvitationRepository) {}

  onModuleInit() {
    this.startCron()
  }

  private startCron() {
    const INTERVAL_MS = 24 * 60 * 60 * 1000
    this.intervalId = setInterval(() => this.handleInvitationExpiry(), INTERVAL_MS)
    this.logger.log('Invitation expiry job scheduled (daily)')
  }

  async handleInvitationExpiry(): Promise<void> {
    this.logger.log('Starting invitation expiry job')

    try {
      const result = await firstValueFrom(
        defer(() => this.invitationRepository.updateManyExpired())
      )

      this.logger.log(`Expired ${result.count} invitations`)
    } catch (error) {
      this.logger.error('Failed to process invitation expiry', error)
    }
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
}
