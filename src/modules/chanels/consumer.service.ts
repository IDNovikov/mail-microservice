import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { CreateMessageDTO } from '../mail/domain/dto/CreateMessageDTO';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);
  constructor(private readonly mailService: MailService) {}

  @RabbitRPC({
    exchange: 'mail',
    routingKey: 'send-mail',
    queue: 'send-mail',
  })
  private async sendVerifyMail(data: CreateMessageDTO) {
    try {
      const sendedMail = await this.mailService.sendMail(data);
      return sendedMail;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
