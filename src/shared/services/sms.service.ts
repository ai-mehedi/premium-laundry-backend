import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppConfigService } from 'src/config/app.config';
import axios from 'axios';

export enum SEND_SMS_TEMPLATE {
  FORGOT_PASSWORD = 'forgot-password',
  ORDER_CONFIRMATION = 'order-confirmation',
  USER_CREATE = 'usercreate',
  ORDER_DELIVERY_OTP = 'order-delivery-otp',
  ORDER_DELIVERY_SUCCESS = 'order-delivery-success'
}

interface SendSMSProps {
  template: SEND_SMS_TEMPLATE;
  phone: string;
  payload?: Record<string, string | number | boolean>;
}

@Injectable()
export class SMSService {
  constructor(private readonly appConfigService: AppConfigService) { }

  async sendSMS({ template, payload, phone }: SendSMSProps) {
    try {
      const message = this.getTemplateContent(template, payload)
        .replace(/\r?\n/g, '\n') // Normalize newlines
        .trim(); // Remove extra whitespace



      const result = await axios.get(this.appConfigService.bulksmsbd.base_url, {
        params: {
          api_key: this.appConfigService.bulksmsbd.api_key,
          senderid: this.appConfigService.bulksmsbd.sender_id,
          type: 'text',
          number: phone,
          message: message, // plain text, not encoded
        },
      });


      return result.data;
    } catch (err) {
      console.error('Error sending SMS:', err);
      throw err;
    }
  }

  getTemplateContent(
    template: SEND_SMS_TEMPLATE,
    payload?: Record<string, string | number | boolean>,
  ): string {
    let content = readFileSync(
      join(global.ROOT_DIR, 'views', 'sms-templates', `${template}.txt`),
      'utf-8',
    );

    if (payload) {
      Object.keys(payload).forEach((key) => {
        content = content.replace(
          new RegExp(`{${key.toUpperCase()}}`, 'g'),
          String(payload[key])
        );
      });
    }

    return content; // return plain text, not encoded
  }
}
