import { Resend } from 'resend';
import { env } from '../../config/env';
import { logger } from '../utils/logger';

const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function send(options: SendEmailOptions): Promise<void> {
  try {
    await resend.emails.send({
      from: env.MAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    logger.info(`Email sent to ${options.to}: ${options.subject}`);
  } catch (error) {
    logger.error('Failed to send email', error);
    throw error;
  }
}

export const EmailService = {
  async sendMail(options: SendEmailOptions): Promise<void> {
    await send(options);
  },

  async sendVerificationCode(email: string, code: string, name: string): Promise<void> {
    await send({
      to: email,
      subject: 'Verify your email — Church App',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">Welcome, ${name}!</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.5;">
            Use the code below to verify your email address. It expires in 10 minutes.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 16px 32px; background: #f4f4f8; border-radius: 12px; color: #1a1a2e;">
              ${code}
            </span>
          </div>
          <p style="color: #999; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  },

  async sendPasswordReset(email: string, code: string): Promise<void> {
    await send({
      to: email,
      subject: 'Reset your password — Church App',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">Password Reset</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.5;">
            Use the code below to reset your password. It expires in 1 hour.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 16px 32px; background: #f4f4f8; border-radius: 12px; color: #1a1a2e;">
              ${code}
            </span>
          </div>
          <p style="color: #999; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  },
};
