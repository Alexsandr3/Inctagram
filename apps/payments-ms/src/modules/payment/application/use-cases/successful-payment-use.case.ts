import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { IPaymentsRepository } from '@payments-ms/modules/payment/infrastructure/payments.repository';
import { StripeEventType } from '@common/main/types/stripe-event.type';
import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';

export class SuccessfulPaymentCommand {
  constructor(public readonly eventType: StripeEventType) {}
}

@CommandHandler(SuccessfulPaymentCommand)
export class SuccessfulPaymentUseCase
  extends BaseNotificationUseCase<SuccessfulPaymentCommand, void>
  implements ICommandHandler<SuccessfulPaymentCommand>
{
  constructor(private readonly paymentsRepository: IPaymentsRepository) {
    super();
  }

  /**
   * Use case to handle successful payment
   * @param command
   */
  async executeUseCase(command: SuccessfulPaymentCommand): Promise<void> {
    const { id } = command.eventType;
    // find current payment with status pending
    const currentPayment = await this.paymentsRepository.getPaymentWithStatusPendingByPaymentSessionId(id);
    if (!currentPayment) return;
    //change payment status to success
    const { payment, event } = currentPayment.changeStatusToSuccess(
      command.eventType,
      `${MICROSERVICES.PAYMENTS}_${SuccessfulPaymentUseCase.name}`,
    );
    //save payment
    await this.paymentsRepository.save(payment, event);
  }
}
