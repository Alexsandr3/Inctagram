import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { PaymentsContract } from '@common/modules/ampq/ampq-contracts/payments.contract';

export class UnActivateSubscriptionCommand {
  constructor(public readonly event: PaymentsContract.requestFailed) {}
}

@CommandHandler(UnActivateSubscriptionCommand)
export class UnActivateSubscriptionUseCase
  extends BaseNotificationUseCase<UnActivateSubscriptionCommand, void>
  implements ICommandHandler<UnActivateSubscriptionCommand>
{
  private readonly logg = new Logger(UnActivateSubscriptionUseCase.name);
  constructor(
    private readonly subscriptionsRepository: ISubscriptionsRepository,
    private readonly usersRepository: IUsersRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {
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
