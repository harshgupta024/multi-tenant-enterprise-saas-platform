import logger from '../logging/logger.js';

export class EmailService {
  /**
   * Mock email sending by printing to standard logger
   */
  static async sendInvitation(email: string, token: string, tenantName: string): Promise<void> {
    const inviteLink = `https://saas-platform.com/accept-invite?token=${token}`;
    
    logger.info({
      to: email,
      subject: `You have been invited to join ${tenantName}`,
      inviteLink
    }, `✉️ [Email Mock] Invitation sent to ${email}. Link: ${inviteLink}`);
  }
}
