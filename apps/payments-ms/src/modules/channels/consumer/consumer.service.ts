import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { PaymentStripeService } from '@payments-ms/modules/payment/application/payment-stripe.service';
import { SubscriptionsContract } from '@common/modules/ampq/ampq-contracts/subscriptions.contract';

@Injectable()
export class ConsumerService {
  constructor(private readonly paymentsService: PaymentStripeService) {}
  @RabbitSubscribe({
    exchange: SubscriptionsContract.queue.exchange.name,
    routingKey: SubscriptionsContract.queue.routingKey,
  })
  async deactivateSubscription(request: SubscriptionsContract.request) {
    const { event } = request.type;
    switch (event) {
      case SubscriptionsContract.SubscriptionEventType.deactivateLastActiveSubscription:
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
