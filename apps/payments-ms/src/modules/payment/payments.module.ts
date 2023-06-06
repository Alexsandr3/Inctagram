import { Module } from '@nestjs/common';
import { DatabaseModule } from '@common/modules/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeController } from '@payments-ms/modules/payment/api/stripe.controller';
import { PaymentStripeService } from '@payments-ms/modules/payment/application/payment-stripe.service';
import { StripePaymentWebhookService } from '@payments-ms/modules/payment/application/stripe-payment-webhook.service';
import { PaymentPaypalService } from '@payments-ms/modules/payment/application/payment-paypal.service';
import { Payment } from '@payments-ms/modules/payment/domain/payment.entity';
import { PaymentGateway } from '@payments-ms/modules/payment/payment-gateway';
import {
  IPaymentsRepository,
  PaymentsRepository,
} from '@payments-ms/modules/payment/infrastructure/payments.repository';
import { CreateSessionUseCase } from '@payments-ms/modules/payment/application/use-cases/create-session-use.case';
import { PaymentsController } from '@payments-ms/modules/payment/api/payments.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { SuccessfulPaymentUseCase } from '@payments-ms/modules/payment/application/use-cases/successful-payment-use.case';
import { FailedPaymentCommand } from '@payments-ms/modules/payment/application/use-cases/failed-payment-use.case';

const useCases = [CreateSessionUseCase, SuccessfulPaymentUseCase, FailedPaymentCommand];

@Module({
  imports: [ApiConfigModule, DatabaseModule, TypeOrmModule.forFeature([Payment]), CqrsModule],
  controllers: [StripeController, PaymentsController],
  providers: [
    ...useCases,
    PaymentGateway,
    PaymentStripeService,
    PaymentPaypalService,
    StripePaymentWebhookService,
    {
      provide: IPaymentsRepository,
      useClass: PaymentsRepository,
    },
  ],
  // exports: [PaymentStripeService, PaymentPaypalService, PaymentGateway],
})
export class PaymentsModule {}
