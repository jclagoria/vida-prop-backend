import type { Invitation } from '@/modules/user-management/domain/entities/invitation.entity'

export class InvitationEmailTemplate {
  static generate(invitation: Invitation, inviterName: string): string {
    const expiryDate = invitation.expiresAt.toLocaleDateString()
    const acceptLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invitations/accept?token=${invitation.token}`

    return `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #1f2937;">Welcome to Habitat</h1>
    <p>Hi,</p>
    <p style="color: #4b5563;">${inviterName} has invited you to join Habitat as a <strong>${invitation.role}</strong>.</p>
    
    <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0;"><strong>Role:</strong> ${invitation.role}</p>
      <p style="margin: 8px 0 0;"><strong>Expires:</strong> ${expiryDate}</p>
    </div>
    
    <a href="${acceptLink}" style="
      background-color: #4F46E5;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      margin: 16px 0;
    ">
      Accept Invitation
    </a>
    
    <p style="color: #9ca3af; font-size: 14px;">
      If you didn't expect this invitation, please ignore this email.
    </p>
  </body>
</html>
    `.trim()
  }
}
