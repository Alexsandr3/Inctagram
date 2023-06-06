import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { IPaymentsRepository } from '@payments-ms/modules/payment/infrastructure/payments.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { StripeEventType } from '@common/main/types/stripe-event.type';
import { PaymentsContract } from '@common/modules/ampq/ampq-contracts/queues/images/payments.contract';
import { randomUUID } from 'crypto';
import { PaymentEventType } from '@common/main/payment-event.type';

export class SuccessfulPaymentCommand {
  constructor(public readonly eventType: StripeEventType) {}
}

@CommandHandler(SuccessfulPaymentCommand)
export class SuccessfulPaymentUseCase
  extends BaseNotificationUseCase<SuccessfulPaymentCommand, void>
  implements ICommandHandler<SuccessfulPaymentCommand>
{
  constructor(
    private readonly paymentsRepository: IPaymentsRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super();
  }

  /**
   * Use case to handle successful payment
   * @param command
   */
  async executeUseCase(command: SuccessfulPaymentCommand): Promise<void> {
    const { id, customer } = command.eventType;
    // find current payment with status pending
    const currentPayment = await this.paymentsRepository.getPaymentWithStatusPendingByPaymentSessionId(id);
    if (!currentPayment) return;
    //change payment status to success
    currentPayment.changeStatusToSuccess(command.eventType);
    //save payment
    await this.paymentsRepository.save(currentPayment);
    //send notification to user
    await this.amqpConnection.publish(PaymentsContract.queue.exchange.name, PaymentsContract.queue.routingKey, {
      requestId: randomUUID(),
      payload: customer,
      timestamp: Date.now(),
      type: PaymentEventType.successSubscription,
    });
  }
}
