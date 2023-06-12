import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentEventType } from '@common/main/payment-event.type';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '@common/main/validators/result-notification';
import { ActivateSubscriptionCommand } from './use-cases/activate-subscription-use.case';
import { UnActivateSubscriptionCommand } from './use-cases/unactivate-subscription-use.case';
import { IsString } from 'class-validator';
import {
  ISuccessfulPaymentRequestInterface,
  PAYMENTS_CONTRACT,
} from '@common/modules/ampq/ampq-contracts/payments.contract';

export class PaymentEventSuccess implements ISuccessfulPaymentRequestInterface {
  @IsString()
  sessionId: string;
  @IsString()
  customer: string;
  @IsString()
  subscription: string;
}

@Injectable()
export class SubscriptionsEventHandler {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Handle successful stripe event
   * @param event
   */
  @OnEvent(PaymentEventType.successSubscription)
  async handleSuccessfulStripeEvent(event: PAYMENTS_CONTRACT.requestSuccess): Promise<void> {
    await this.commandBus.execute<ActivateSubscriptionCommand, ResultNotification<void>>(
      new ActivateSubscriptionCommand(event.payload),
    );
    return;
  }

  /**
   * Handle failed stripe event
   * @param event
   */
  @OnEvent(PaymentEventType.failedSubscription)
  async handleFailedSubscriptionEventFromStripe(event: PAYMENTS_CONTRACT.requestFailed): Promise<void> {
    await this.commandBus.execute<UnActivateSubscriptionCommand, ResultNotification<void>>(
      new UnActivateSubscriptionCommand(event),
    );
    return;
  }
}
