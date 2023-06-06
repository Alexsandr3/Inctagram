import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { IPaymentsRepository } from '@payments-ms/modules/payment/infrastructure/payments.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { StripeEventType } from '@common/main/types/stripe-event.type';
import { PaymentsContract } from '@common/modules/ampq/ampq-contracts/queues/images/payments.contract';
import { randomUUID } from 'crypto';
import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';
import { Logger } from '@nestjs/common';

export class FailedPaymentCommand {
  constructor(public readonly eventType: StripeEventType) {}
}

@CommandHandler(FailedPaymentCommand)
export class FailedPaymentUseCase
  extends BaseNotificationUseCase<FailedPaymentCommand, void>
  implements ICommandHandler<FailedPaymentCommand>
{
  private readonly logg = new Logger(FailedPaymentUseCase.name);
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
    const message = {
      requestId: randomUUID(),
      payload: { customer },
      timestamp: Date.now(),
      type: {
        microservice: MICROSERVICES.PAYMENTS,
        event: PaymentsContract.PaymentEventType.failedPayment,
      },
    };
    await this.amqpConnection.publish<PaymentsContract.requestFailed>(
      PaymentsContract.queue.exchange.name,
      PaymentsContract.queue.routingKey,
      message,
    );
    this.logg.log(
      `Message sent to queue ${PaymentsContract.queue.exchange.name} with message ${JSON.stringify(message)} from ${
        FailedPaymentUseCase.name
      }`,
    );
  }
}
