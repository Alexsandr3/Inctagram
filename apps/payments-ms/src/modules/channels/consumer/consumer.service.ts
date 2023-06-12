import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { PaymentStripeService } from '@payments-ms/modules/payment/application/payment-stripe.service';
import { PAYMENTS_CONTRACT } from '@common/modules/ampq/ampq-contracts/payments.contract';

@Injectable()
export class ConsumerService {
  constructor(private readonly paymentsService: PaymentStripeService) {}
  @RabbitSubscribe({
    exchange: PAYMENTS_CONTRACT.queue_subscriptions.exchange.name,
    queue: PAYMENTS_CONTRACT.queue_subscriptions.queue,
    routingKey: PAYMENTS_CONTRACT.queue_subscriptions.routingKey,
  })
  async deactivateSubscription(request: PAYMENTS_CONTRACT.request) {
    const { eventName } = request;
    switch (eventName) {
      case PAYMENTS_CONTRACT.EVENTS.SUBSCRIPTIONS.deactivateLastActiveSubscription:
        await this.paymentsService.deactivateLastActiveSubscription(
          request.payload.customerId,
          request.payload.subscriptionId,
        );
        break;
      default:
        break;
    }
    return;
  }
}
