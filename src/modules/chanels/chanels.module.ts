import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [ConsumerService, RedisService],
})
export class ChannelsModule {}
