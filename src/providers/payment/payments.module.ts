import { Module } from '@nestjs/common';
import { StripeController } from './api/stripe.controller';
import { StripeService } from './application/stripe.service';
import { ApiConfigModule } from '../../modules/api-config/api.config.module';
import { PaymentService } from './application/payment.service';
import { StripePaymentWebhookService } from './application/stripe-payment-webhook.service';

@Module({
  imports: [ApiConfigModule],
  controllers: [StripeController],
  providers: [StripeService, PaymentService, StripePaymentWebhookService],
  exports: [PaymentService],
})
export class PaymentsModule {}
