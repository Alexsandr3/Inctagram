import { Module } from '@nestjs/common';
import { ConsumerService } from '@images-ms/modules/channels/consumer/consumer.service';
import { ImagesModule } from '@images-ms/modules/images/images.module';

@Module({
  imports: [ImagesModule],
  providers: [ConsumerService],
})
export class ChannelsModule {}
