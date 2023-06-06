import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { IPaymentsRepository } from '@payments-ms/modules/payment/infrastructure/payments.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { StripeEventType } from '@common/main/types/stripe-event.type';
import { PaymentsContract } from '@common/modules/ampq/ampq-contracts/queues/images/payments.contract';
import { randomUUID } from 'crypto';
import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';
import { Logger } from '@nestjs/common';
import { FailedPaymentUseCase } from '@payments-ms/modules/payment/application/use-cases/failed-payment-use.case';

export class SuccessfulPaymentCommand {
  constructor(public readonly eventType: StripeEventType) {}
}

@CommandHandler(SuccessfulPaymentCommand)
export class SuccessfulPaymentUseCase
  extends BaseNotificationUseCase<SuccessfulPaymentCommand, void>
  implements ICommandHandler<SuccessfulPaymentCommand>
{
  private readonly logg = new Logger(SuccessfulPaymentUseCase.name);
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
    const message: PaymentsContract.requestSuccess = {
      requestId: randomUUID(),
      payload: {
        sessionId: id,
        customer: customer,
      },
      timestamp: Date.now(),
      type: {
        microservice: MICROSERVICES.PAYMENTS,
        event: PaymentsContract.PaymentEventType.successfulPayment,
      },
    };
    await this.amqpConnection.publish<PaymentsContract.requestSuccess>(
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
