import { Module } from '@nestjs/common';
import { ClientImagesAdapter } from './client-images-adapter';
import { ClientImagesService } from './client-images-service';
import { ClientPaymentsService } from './client-payments-service';
import { ClientPaymentsAdapter } from './client-payments-adapter';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';

@Module({
  imports: [ApiConfigModule],
  providers: [ClientImagesAdapter, ClientPaymentsAdapter, ClientImagesService, ClientPaymentsService],
  exports: [ClientImagesService, ClientPaymentsService],
})
export class ClientModule {}
