import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentEventType } from '@common/main/payment-event.type';
import { PaymentsContract } from '@common/modules/ampq/ampq-contracts/payments.contract';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class ConsumerService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @RabbitSubscribe({
    exchange: PaymentsContract.queue.exchange.name,
    routingKey: PaymentsContract.queue.routingKey,
  })
  async paymentEvent(request: PaymentsContract.requestSuccess | PaymentsContract.requestFailed): Promise<void> {
    const { event } = request.type;
    switch (event) {
      case PaymentsContract.PaymentEventType.successfulPayment:
        this.eventEmitter.emit(PaymentEventType.successSubscription, request);
        break;
      case PaymentsContract.PaymentEventType.failedPayment:
        this.eventEmitter.emit(PaymentEventType.failedSubscription, request);
        break;
      default:
        break;
    }
    return;
  }
}
