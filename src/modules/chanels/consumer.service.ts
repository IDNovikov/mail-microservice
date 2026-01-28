import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);
  constructor(private readonly mailService: MailService) {}

  @RabbitRPC({
    exchange: 'mail',
    routingKey: 'send-mail',
    queue: 'send-mail',
  })
  private async sendVerifyMail(to: string, code: string) {
    this.logger.log(to, code);
    await this.mailService.sendVerificationMail(to, code);
  }
}
