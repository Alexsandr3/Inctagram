import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';
import { PaymentsContract } from '@common/modules/ampq/ampq-contracts/payments.contract';

export class UnActivateSubscriptionCommand {
  constructor(public readonly event: PaymentsContract.requestFailed) {}
}

@CommandHandler(UnActivateSubscriptionCommand)
export class UnActivateSubscriptionUseCase
  extends BaseNotificationUseCase<UnActivateSubscriptionCommand, void>
  implements ICommandHandler<UnActivateSubscriptionCommand>
{
  constructor(private readonly subscriptionsRepository: ISubscriptionsRepository) {
    super();
  }

  /**
   * Use case unactivate subscription
   * @param command
   */
  async executeUseCase(command: UnActivateSubscriptionCommand): Promise<void> {
    const { customer, sessionId } = command.event.payload;
    // find subscription where payments contains paymentSessionId
    const subscriptionEntity = await this.subscriptionsRepository.getSubscriptionWithStatusPendingByPaymentSessionId(
      sessionId,
    );
    // update subscription status to active
    subscriptionEntity.changeStatusToFailing(customer, sessionId);
    //save subscription
    await this.subscriptionsRepository.saveSubscriptionWithPayment(subscriptionEntity);
  }
}
