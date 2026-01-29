import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { MessageHandlerErrorBehavior, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { SendMailContract } from '../amqp/contracts/queues/mail/send-mail.contract';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);
  constructor(private readonly mailService: MailService) {}

  @RabbitRPC({
    exchange: SendMailContract.queue.exchange.name,
    routingKey: SendMailContract.queue.routingKey,
    queue: SendMailContract.queue.queue,
     errorBehavior: MessageHandlerErrorBehavior.NACK,
  errorHandler: (channel, msg, err) => {
    console.error('RPC error:', err);
    channel.nack(msg, false, false);
  },})
  private async sendVerifyMail(request: SendMailContract.request):Promise<SendMailContract.response> {
    
   this.logger.log(request)
   
    const{payload, ...requestMessage}=request
    try {
      const sendedMail = await this.mailService.sendMail(payload);
      this.logger.log(sendedMail)
      return {
        ...request,
        payload:{
          isMailSended:!!sendedMail
        }
      };
    } catch (err) {
      this.logger.error(err);
      return {
        ...requestMessage,
        payload:{isMailSended:false}, 
        error:this.errorHandler(err)
      }
    }
  }

  private errorHandler(error:Error) {
    return {
      code: error?.name || "error",
      message:error?.message|| JSON.stringify(error)
    }
  }
}
