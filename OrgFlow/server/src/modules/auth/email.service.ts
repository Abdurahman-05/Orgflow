import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import { env } from "../../env";

/**
 * WHY: We use a dedicated email service to centralize all email-related logic.
 * This makes it easier to swap providers or update templates in one place.
 */
class EmailService {
  private transport;
  private sender = {
    address: "info@demomailtrap.co",
    name: "Mailtrap Test",
  };

  constructor() {
    // WHY: Use the existing Mailtrap transport as requested by the user.
    this.transport = Nodemailer.createTransport(
      MailtrapTransport({
        token: env.MAILTRAP_TOKEN,
      })
    );
  }

  /**
   * WHY: Sends a verification email to the user after registration.
   * The link points to the frontend which will then call our verification API.
   */
  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${env.FRONTEND_URL}/verify-email?token=${token}`;

    await this.transport.sendMail({
      from: this.sender,
      to: [email],
      subject: "Verify your email",
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }
}

export const emailService = new EmailService();
