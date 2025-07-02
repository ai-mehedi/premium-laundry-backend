import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { AppConfigService } from 'src/config/app.config';

export enum SEND_EMAIL_TEMPLATE {
  USER_REGISTRATION = 'user-registration',
  FORGOT_PASSWORD = 'forgot-password',
}

interface SendEmailProps {
  template: SEND_EMAIL_TEMPLATE;
  email: string;
  subject: string;
  payload?: Record<string, string | number | boolean>;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class MailService {
  constructor(private readonly appConfigService: AppConfigService) {}

  async sendEmail({ template, payload, email, subject }: SendEmailProps) {
    try {
      const host = this.appConfigService.smtp.host;
      const port = this.appConfigService.smtp.port;
      const username = this.appConfigService.smtp.username;
      const password = this.appConfigService.smtp.password;
      const fromName = this.appConfigService.smtp.from_name;
      const fromEmail = this.appConfigService.smtp.from_email;

      const content = this.getTemplateContent(template, payload);
      const mailOptions: MailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: email,
        subject,
        html: content,
      };

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user: username,
          pass: password,
        },
      });

      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error('Error sending email:', err);
    }
  }
  getTemplateContent(
    template: SEND_EMAIL_TEMPLATE,
    payload?: Record<string, string | number | boolean>,
  ): string {
    const layout = readFileSync(
      join(global.ROOT_DIR, 'views', 'email-templates', 'layout.html'),
      'utf-8',
    );

    let content = readFileSync(
      join(global.ROOT_DIR, 'views', 'email-templates', `${template}.html`),
      'utf-8',
    );
    if (payload) {
      Object.keys(payload).forEach((key) => {
        console.log(`Replacing {{${key.toUpperCase()}}} with ${payload[key]}`);
        content = content
          .split(`{{${key.toUpperCase()}}}`)
          .join(`${payload[key]}`);
      });
    }
    layout.replace('{{CONTENT}}', content);
    return content;
  }
}
