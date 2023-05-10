import { Module } from '@nestjs/common';
import { StripeController } from './api/stripe.controller';
import { ApiConfigModule } from '../../modules/api-config/api.config.module';
import { PaymentStripeService } from './application/payment-stripe.service';
import { StripePaymentWebhookService } from './application/stripe-payment-webhook.service';

@Module({
  imports: [ApiConfigModule],
  controllers: [StripeController],
  providers: [PaymentStripeService, StripePaymentWebhookService],
  exports: [PaymentStripeService],
})
export class PaymentsModule {}
