import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentEventType } from '@common/main/payment-event.type';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { PAYMENTS_CONTRACT } from '@common/modules/ampq/ampq-contracts/payments.contract';

@Injectable()
export class ConsumerService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @RabbitSubscribe({
    exchange: PAYMENTS_CONTRACT.queue_payments.exchange.name,
    queue: PAYMENTS_CONTRACT.queue_payments.queue,
    routingKey: PAYMENTS_CONTRACT.queue_payments.routingKey,
  })
  async paymentEvent(request: PAYMENTS_CONTRACT.requestSuccess | PAYMENTS_CONTRACT.requestFailed): Promise<void> {
    const { eventName } = request;
    switch (eventName) {
      case PAYMENTS_CONTRACT.EVENTS.PAYMENTS.successfulPayment:
        this.eventEmitter.emit(PaymentEventType.successSubscription, request);
        break;
      case PAYMENTS_CONTRACT.EVENTS.PAYMENTS.failedPayment:
        this.eventEmitter.emit(PaymentEventType.failedSubscription, request);
        break;
      default:
        break;
    }
    return;
  }
}
