import { Injectable } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import {
  CreatedSessionResponseInterface,
  CreateSessionRequestInterface,
  SubscriptionsContract,
} from '@common/modules/ampq/ampq-contracts/queues/images/subscriptions.contract';
import { PaymentGateway } from '@payments-ms/modules/payment/payment-gateway';

@Injectable()
export class ConsumerService {
  constructor(private readonly paymentGateway: PaymentGateway) {}
  @RabbitRPC({
    exchange: SubscriptionsContract.queue.exchange.name,
    routingKey: SubscriptionsContract.queue.routingKey,
    queue: SubscriptionsContract.queue.queue,
  })
  async createSession(request: CreateSessionRequestInterface): Promise<CreatedSessionResponseInterface> {
    return this.paymentGateway.createSession(request);
  }
}
