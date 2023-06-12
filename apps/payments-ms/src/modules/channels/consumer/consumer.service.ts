import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { PaymentStripeService } from '@payments-ms/modules/payment/application/payment-stripe.service';
import { AMPQ_CONTRACT } from '@common/modules/ampq/ampq-contracts/ampq.contract';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';

@Injectable()
export class ConsumerService {
  constructor(private readonly paymentsService: PaymentStripeService) {}
  @RabbitSubscribe({
    exchange: AMPQ_CONTRACT.queue.exchange.name,
    queue: AMPQ_CONTRACT.queue_payments.queue,
    routingKey: AMPQ_CONTRACT.queue.routingKey,
  })
  async deactivateSubscription(request: OutboxEventEntity) {
    const { eventName } = request;
    switch (eventName) {
      case AMPQ_CONTRACT.EVENTS.SUBSCRIPTIONS.deactivateLastActiveSubscription:
        await this.paymentsService.deactivateLastActiveSubscription(
          // @ts-ignore
          request.payload.customerId,
          // @ts-ignore
          request.payload.subscriptionId,
        );
        break;
      default:
        break;
    }
    return;
  }
}
