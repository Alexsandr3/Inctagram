import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { PaymentEventSuccess } from '../subscriptions-event-handler';
import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';

export class ActivateSubscriptionCommand {
  constructor(public readonly event: PaymentEventSuccess) {}
}

@CommandHandler(ActivateSubscriptionCommand)
export class ActivateSubscriptionUseCase
  extends BaseNotificationUseCase<ActivateSubscriptionCommand, void>
  implements ICommandHandler<ActivateSubscriptionCommand>
{
  constructor(
    private readonly subscriptionsRepository: ISubscriptionsRepository,
    private readonly usersRepository: IUsersRepository,
  ) {
    super();
  }

  /**
   * Use case to activate subscription
   * @param command
   */
  async executeUseCase(command: ActivateSubscriptionCommand): Promise<void> {
    const { sessionId } = command.event;
    const currentSubscription = await this.subscriptionsRepository.getSubscriptionWithStatusPendingByPaymentSessionId(
      sessionId,
    );
    if (!currentSubscription) return;
    //find last created active subscription by customer id
    const lastActiveSubscription = await this.subscriptionsRepository.getLastActiveCreatedSubscriptionByCustomerId(
      currentSubscription.customerId,
    );
    let currentPeriodEnd;
    if (lastActiveSubscription) {
      currentPeriodEnd = lastActiveSubscription.endDate;
      lastActiveSubscription.disableAutoRenewal();
      await this.subscriptionsRepository.saveSubscriptionWithPayment(lastActiveSubscription);
    }
    const { subscription, event } = currentSubscription.changeStatusToActive(
      command.event,
      currentPeriodEnd,
      `${MICROSERVICES.MAIN}_${ActivateSubscriptionUseCase.name}`,
    );
    const user = await this.usersRepository.findById(currentSubscription.businessAccountId);
    //activate user - hasActiveBusinessAccount = true
    user.activateBusinessAccount();
    await this.usersRepository.updateExistingUser(user);
    try {
      //save subscription with payment
      await this.subscriptionsRepository.saveSubscriptionWithPayment(subscription, event);
    } catch (e) {
      user.deactivateBusinessAccount();
      await this.usersRepository.updateExistingUser(user);
    }
  }
}
