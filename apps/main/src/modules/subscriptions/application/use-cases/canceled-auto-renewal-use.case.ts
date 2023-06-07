import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { NotificationException } from '@common/main/validators/result-notification';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';
import { NotificationCode } from '@common/configuration/notificationCode';
import { ClientPaymentsService } from '../../../Clients/client-payments-service';

export class CanceledAutoRenewalCommand {
  constructor(public readonly userId: number) {}
}

@CommandHandler(CanceledAutoRenewalCommand)
export class CanceledAutoRenewalUseCase
  extends BaseNotificationUseCase<CanceledAutoRenewalCommand, void>
  implements ICommandHandler<CanceledAutoRenewalCommand>
{
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly subscriptionsRepository: ISubscriptionsRepository,
    private readonly clientPaymentService: ClientPaymentsService,
  ) {
    super();
  }

  /**
   * Create subscription with payment with status pending
   * @param command
   */
  async executeUseCase(command: CanceledAutoRenewalCommand): Promise<void> {
    const { userId } = command;
    //find user
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    //check if user has active  payments-ms account
    const businessAccount = await this.subscriptionsRepository.findBusinessAccountByUserId(userId);
    if (businessAccount.subscriptions.length === 0)
      throw new NotificationException(
        `User with id: ${userId} has not active subscription`,
        'user',
        NotificationCode.NOT_FOUND,
      );
    //find active subscription from another microservice
    const activeSubscription = await this.clientPaymentService.findSubscriptions(businessAccount.stipeCustomerId);
    //cancel subscription
    await this.clientPaymentService.cancelSubscription(activeSubscription.data[0].id);
    //change status to canceled
    businessAccount.changeStatusToCanceledAutoRenewal();
    //save
    await this.subscriptionsRepository.updateBusinessAccountWithSubscriptionAndPayment(businessAccount);
    return;
  }
}
