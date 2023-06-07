import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { PaymentEventSuccess } from '../subscriptions-event-handler';
import { SubscriptionsContract } from '@common/modules/ampq/ampq-contracts/subscriptions.contract';

export class ActivateSubscriptionCommand {
  constructor(public readonly event: PaymentEventSuccess) {}
}

@CommandHandler(ActivateSubscriptionCommand)
export class ActivateSubscriptionUseCase
  extends BaseNotificationUseCase<ActivateSubscriptionCommand, void>
  implements ICommandHandler<ActivateSubscriptionCommand>
{
  private readonly logg = new Logger(ActivateSubscriptionUseCase.name);
  constructor(
    private readonly subscriptionsRepository: ISubscriptionsRepository,
    private readonly usersRepository: IUsersRepository,
    private readonly amqpConnection: AmqpConnection,
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
    currentSubscription.changeStatusToActive(command.event, currentPeriodEnd);
    //save subscription with payment
    await this.subscriptionsRepository.saveSubscriptionWithPayment(currentSubscription);
    //send notification to queue that deactivate last active subscription
    const message: SubscriptionsContract.request = {
      requestId: currentSubscription.id,
      payload: {
        customerId: currentSubscription.customerId,
        subscriptionId: currentSubscription.id,
      },
      timestamp: Date.now(),
      type: {
        microservice: MICROSERVICES.MAIN,
        event: SubscriptionsContract.SubscriptionEventType.deactivateLastActiveSubscription,
      },
    };
    await this.amqpConnection.publish<SubscriptionsContract.request>(
      SubscriptionsContract.queue.exchange.name,
      SubscriptionsContract.queue.routingKey,
      message,
    );
    // await this.paymentStripeService.deactivateLastActiveSubscription(event.customer, event.subscription);
    const user = await this.usersRepository.findById(currentSubscription.businessAccountId);
    //activate user - hasActiveBusinessAccount = true
    user.activateBusinessAccount();
    await this.usersRepository.updateExistingUser(user);
    this.logg.log(
      `Message sent to queue ${SubscriptionsContract.queue.exchange.name} with message ${JSON.stringify(
        message,
      )} from ${ActivateSubscriptionUseCase.name}`,
    );
  }
}
