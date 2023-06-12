import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { IPaymentsRepository } from '@payments-ms/modules/payment/infrastructure/payments.repository';
import { StripeEventType } from '@common/main/types/stripe-event.type';
import { Logger } from '@nestjs/common';
import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';

export class FailedPaymentCommand {
  constructor(public readonly eventType: StripeEventType) {}
}

@CommandHandler(FailedPaymentCommand)
export class FailedPaymentUseCase
  extends BaseNotificationUseCase<FailedPaymentCommand, void>
  implements ICommandHandler<FailedPaymentCommand>
{
  private readonly logg = new Logger(FailedPaymentUseCase.name);
  constructor(private readonly paymentsRepository: IPaymentsRepository) {
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
    const { payment, event } = currentPayment.changeStatusToFailed(
      command.eventType,
      `${MICROSERVICES.PAYMENTS}_${FailedPaymentUseCase.name}`,
    );
    //save payment
    await this.paymentsRepository.save(payment, event);
  }
}
