import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { RedisService } from '../redis/redis.service';

@Global()
@Module({
  imports: [ConfigModule, RedisService],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
