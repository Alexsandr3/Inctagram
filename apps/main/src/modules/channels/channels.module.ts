import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConsumerService } from './consumer/consumer.service';

@Module({
  imports: [CqrsModule, EventEmitterModule.forRoot()],
  providers: [ConsumerService],
})
export class ChannelsModule {}
