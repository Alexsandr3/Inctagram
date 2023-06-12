import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentEventType } from '@common/main/payment-event.type';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '@common/main/validators/result-notification';
import { ActivateSubscriptionCommand } from './use-cases/activate-subscription-use.case';
import { UnActivateSubscriptionCommand } from './use-cases/unactivate-subscription-use.case';
import { IsString } from 'class-validator';
import { SuccessfulPaymentRequestInterface } from '@common/modules/ampq/ampq-contracts/payments.contract';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';

export class PaymentEventSuccess implements SuccessfulPaymentRequestInterface {
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
  async handleSuccessfulStripeEvent(event: OutboxEventEntity): Promise<void> {
    await this.commandBus.execute<ActivateSubscriptionCommand, ResultNotification<void>>(
      // @ts-ignore
      new ActivateSubscriptionCommand(event.payload),
    );
    return;
  }

  /**
   * Handle failed stripe event
   * @param event
   */
  @OnEvent(PaymentEventType.failedSubscription)
  async handleFailedSubscriptionEventFromStripe(event: OutboxEventEntity): Promise<void> {
    await this.commandBus.execute<UnActivateSubscriptionCommand, ResultNotification<void>>(
      // @ts-ignore
      new UnActivateSubscriptionCommand(event),
    );
    return;
  }
}
