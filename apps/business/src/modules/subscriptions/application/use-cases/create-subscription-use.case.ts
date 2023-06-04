import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { NotificationException } from '@common/main/validators/result-notification';
import { IUsersRepository } from '../../../../../../inctagram/src/modules/users/infrastructure/users.repository';
import { CreateSubscriptionInputDto } from '../../api/input-dtos/create-subscription-input.dto';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';
import { NotificationCode } from '@common/configuration/notificationCode';
import { PaymentGateway } from '../../../payment/payment-gateway';

export class CreateSubscriptionCommand {
  constructor(public readonly userId: number, public readonly createSubscriptionDto: CreateSubscriptionInputDto) {}
}

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionUseCase
  extends BaseNotificationUseCase<CreateSubscriptionCommand, string>
  implements ICommandHandler<CreateSubscriptionCommand>
{
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly subscriptionsRepository: ISubscriptionsRepository,
  ) {
    super();
  }

  /**
   * Create subscription with payment with status pending
   * @param command
   */
  async executeUseCase(command: CreateSubscriptionCommand): Promise<string> {
    const { userId, createSubscriptionDto } = command;
    //find user
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    //check if user has active  business account
    const businessAccount = await this.subscriptionsRepository.findBusinessAccountByUserId(userId);
    // create session for payment
    const { customer, id, url } = await this.paymentGateway.createSession({
      customerId: businessAccount.stipeCustomerId,
      email: user.email,
      userName: user.userName,
      subscriptionType: createSubscriptionDto,
    });
    //update business account with new subscription
    businessAccount.updateCurrentSubscriptionAndAddNewSubscriptionWithPayment(
      id,
      customer as string,
      createSubscriptionDto,
    );
    //save business account with subscription and payment
    await this.subscriptionsRepository.updateBusinessAccountWithSubscriptionAndPayment(businessAccount);
    //return session url
    return url;
  }
}
