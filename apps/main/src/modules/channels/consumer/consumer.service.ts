import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentEventType } from '@common/main/payment-event.type';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { AMPQ_CONTRACT } from '@common/modules/ampq/ampq-contracts/ampq.contract';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';

@Injectable()
export class ConsumerService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @RabbitSubscribe({
    exchange: AMPQ_CONTRACT.queue.exchange.name,
    queue: AMPQ_CONTRACT.queue.queue,
    routingKey: AMPQ_CONTRACT.queue.routingKey,
  })
  async paymentEvent(request: OutboxEventEntity): Promise<void> {
    const { eventName } = request;
    switch (eventName) {
      case AMPQ_CONTRACT.EVENTS.PAYMENTS.successfulPayment:
        this.eventEmitter.emit(PaymentEventType.successSubscription, request);
        break;
      case AMPQ_CONTRACT.EVENTS.PAYMENTS.failedPayment:
        this.eventEmitter.emit(PaymentEventType.failedSubscription, request);
        break;
      default:
        break;
    }
    return;
  }
}
