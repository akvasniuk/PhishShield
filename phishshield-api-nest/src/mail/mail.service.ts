import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
const EmailTemplates = require('email-templates');
import { ConfigService } from '@nestjs/config';
import { templateInfo } from './email-templates';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private templateParser: typeof EmailTemplates;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('SYSTEM_EMAIL'),
        pass: this.configService.get<string>('SYSTEM_EMAIL_PASSWORD'),
      },
    });

    this.templateParser = new EmailTemplates({
      views: {
        root: path.join(process.cwd(), 'src', 'mail', 'email-templates'),
      },
    });
  }

  async sendMail(userMail: string, action: keyof typeof templateInfo, context: Record<string, any>) {
    try {
      const templateToSend = templateInfo[action];

      if (!templateToSend) {
        throw new BadRequestException('Invalid email template.');
      }

      const html = await this.templateParser.render(templateToSend.templateName, context);

      return this.transporter.sendMail({
        from: 'No Reply',
        to: userMail,
        subject: templateToSend.subject,
        html,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
