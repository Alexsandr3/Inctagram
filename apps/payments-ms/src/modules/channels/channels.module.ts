import { Module } from '@nestjs/common';
import { ConsumerService } from '@payments-ms/modules/channels/consumer/consumer.service';
import { PaymentsModule } from '@payments-ms/modules/payment/payments.module';

@Module({
  imports: [PaymentsModule],
  providers: [ConsumerService],
})
export class ChannelsModule {}
