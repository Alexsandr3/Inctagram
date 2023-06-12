import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { IPaymentsRepository } from '@payments-ms/modules/payment/infrastructure/payments.repository';
import { StripeEventType } from '@common/main/types/stripe-event.type';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OUTBOX_EVENT } from '@common/modules/outbox/outbox.processor';
import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';

export class SuccessfulPaymentCommand {
  constructor(public readonly eventType: StripeEventType) {}
}

@CommandHandler(SuccessfulPaymentCommand)
export class SuccessfulPaymentUseCase
  extends BaseNotificationUseCase<SuccessfulPaymentCommand, void>
  implements ICommandHandler<SuccessfulPaymentCommand>
{
  private readonly logg = new Logger(SuccessfulPaymentUseCase.name);
  constructor(private readonly paymentsRepository: IPaymentsRepository, private readonly eventEmitter: EventEmitter2) {
    super();
  }

  /**
   * Use case to handle successful payment
   * @param command
   */
  async executeUseCase(command: SuccessfulPaymentCommand): Promise<void> {
    const { id, customer, subscription } = command.eventType;
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
    //send notification to user
    this.eventEmitter.emit(OUTBOX_EVENT, event);
  }
}
