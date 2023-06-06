import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { IPaymentsRepository } from '@payments-ms/modules/payment/infrastructure/payments.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { StripeEventType } from '@common/main/types/stripe-event.type';
import { PaymentsContract } from '@common/modules/ampq/ampq-contracts/queues/images/payments.contract';
import { randomUUID } from 'crypto';
import { PaymentEventType } from '@common/main/payment-event.type';

export class FailedPaymentCommand {
  constructor(public readonly eventType: StripeEventType) {}
}

@CommandHandler(FailedPaymentCommand)
export class FailedPaymentUseCase
  extends BaseNotificationUseCase<FailedPaymentCommand, void>
  implements ICommandHandler<FailedPaymentCommand>
{
  constructor(
    private readonly paymentsRepository: IPaymentsRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super();
  }

  /**
   * Use case to handle failed payment
   * @param command
   */
  async executeUseCase(command: FailedPaymentCommand): Promise<void> {
    const { id, customer } = command.eventType;
    // find current payment with status pending
    const currentPayment = await this.paymentsRepository.getPaymentWithStatusPendingByPaymentSessionId(id);
    if (!currentPayment) return;
    //change payment status to failed
    currentPayment.changeStatusToFailed(command.eventType);
    //save payment
    await this.paymentsRepository.save(currentPayment);
    //send notification to user
    await this.amqpConnection.publish(PaymentsContract.queue.exchange.name, PaymentsContract.queue.routingKey, {
      requestId: randomUUID(),
      payload: customer,
      timestamp: Date.now(),
      type: PaymentEventType.failedSubscription,
    });
  }
}
