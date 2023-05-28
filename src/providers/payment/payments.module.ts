import { Module } from '@nestjs/common';
import { StripeController } from './api/stripe.controller';
import { ApiConfigModule } from '../../modules/api-config/api.config.module';
import { PaymentStripeService } from './application/payment-stripe.service';
import { StripePaymentWebhookService } from './application/stripe-payment-webhook.service';
import { PaymentPaypalService } from './application/payment-paypal.service';
import { PaymentGateway } from './payment-gateway';

@Module({
  imports: [ApiConfigModule],
  controllers: [StripeController],
  providers: [PaymentStripeService, StripePaymentWebhookService, PaymentPaypalService, PaymentGateway],
  exports: [PaymentStripeService, PaymentPaypalService, PaymentGateway],
})
export class PaymentsModule {}
