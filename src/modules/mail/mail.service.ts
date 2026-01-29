import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { CreateMessageDTO } from './domain/dto/CreateMessageDTO';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly config: ConfigService) {}
  onModuleInit() {
    const host = (this.config.get<string>('SMTP_HOST') ?? '').trim();
    const port = Number(this.config.get('SMTP_PORT')) || 465;
    const user = this.config.get<string>('EMAIL_USER');
    const pass = this.config.get<string>('EMAIL_PASS');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  async sendMail(dto: CreateMessageDTO) {
    console.log(dto)
    const { toEmail, subject, text, html } = dto;
    try {
      const info = await this.transporter.sendMail({
        from: `"AfishaVed" <${this.config.get('EMAIL_USER')}>`,
        to:toEmail,
        subject,
        text,
        html: html ?? text,
      });
      return info
    } catch (error) {
      this.logger.error(error.stack);
      throw new ServiceUnavailableException('Error with mailer');
    }
  }

  // async sendVerificationMail(to: string, code: string) {
  //   const html = `
  //     <div style="font-family:sans-serif;padding:20px">
  //       <h2>Подтверждение почты</h2>
  //       <p>Ваш код: <b>${code}</b></p>
  //       <p>Он действителен 10 минут.</p>
  //     </div>`;

  //   await this.sendMail(to, 'Код подтверждения', `Ваш код: ${code}`, html);
  // }

  // async sendTempPass(to: string, tempPass: string) {
  //   const html = `
  //     <div style="font-family:sans-serif;padding:20px">
  //       <h2>Временный пароль</h2>
  //       <p>Пароль: <b>${tempPass}</b></p>
  //       <p>После входа, пожалуйста, как можно быстрее обновите пароль</p>
  //     </div>`;

  //   await this.sendMail(to, 'Временный пароль', `Пароль: ${tempPass}`, html);
  // }
}
