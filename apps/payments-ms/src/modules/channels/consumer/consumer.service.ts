import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { SubscriptionsContract } from '@common/modules/ampq/ampq-contracts/queues/images/subscriptions.contract';
import { PaymentStripeService } from '@payments-ms/modules/payment/application/payment-stripe.service';

@Injectable()
export class ConsumerService {
  constructor(private readonly paymentsService: PaymentStripeService) {}
  @RabbitSubscribe({
    exchange: SubscriptionsContract.queue.exchange.name,
    routingKey: SubscriptionsContract.queue.routingKey,
  })
  async deactivateSubscription(request: SubscriptionsContract.request) {
    return this.paymentsService.deactivateLastActiveSubscription(
      request.payload.customerId,
      request.payload.subscriptionId,
    );
  }
}
