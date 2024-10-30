import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { config } from '../config/config.service';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: config.EMAIL.HOST,
  port: 587,
  secure: false, // should be false for TLS on port 587
  auth: {
    user: config.EMAIL.USER || '',
    pass: config.EMAIL.PASSWORD || '',
  },
});

type MailDataProps = {
  recipient: string;
  subject: string;
  html: string;
};

@Injectable()
export class EmailService {
  async sendMail({ recipient, subject, html }: MailDataProps): Promise<void> {
    try {
      const info = await transporter.sendMail({
        from: '"Task Manager" <no-reply@yourdomain.com>',
        to: recipient,
        subject,
        html,
      });
      console.log('Email sent:', info.response);
    } catch (error) {
      throw new BadRequestException('Failed to send email');
    }
  }
}
