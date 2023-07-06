import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentEventType } from '@common/main/payment-event.type';
import { StripeEventType } from '@common/main/types/stripe-event.type';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '@common/main/validators/result-notification';
import { SuccessfulPaymentCommand } from '@payments-ms/modules/payment/application/use-cases/successful-payment-use.case';
import { FailedPaymentCommand } from '@payments-ms/modules/payment/application/use-cases/failed-payment-use.case';

@Injectable()
export class PaymentsEventHandler {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Handle successful stripe event
   * @param event
   */
  @OnEvent(PaymentEventType.successSubscription)
  async handleSuccessfulStripeEvent(event: StripeEventType): Promise<void> {
    await this.commandBus.execute<SuccessfulPaymentCommand, ResultNotification<void>>(
      new SuccessfulPaymentCommand(event),
    );
    return;
  }

  /**
   * Handle failed stripe event
   * @param event
   */
  @OnEvent(PaymentEventType.failedSubscription)
  async handleFailedSubscriptionEventFromStripe(event: StripeEventType): Promise<void> {
    await this.commandBus.execute<FailedPaymentCommand, ResultNotification<void>>(new FailedPaymentCommand(event));
    return;
  }
}
