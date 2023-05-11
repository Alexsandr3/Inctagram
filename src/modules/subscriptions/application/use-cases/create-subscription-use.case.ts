import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { CreateSubscriptionInputDto } from '../../api/input-dtos/create-subscription-input.dto';
import { PaymentStripeService } from '../../../../providers/payment/application/payment-stripe.service';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';

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
    private readonly paymentStripeService: PaymentStripeService,
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
    //create session for payment
    const session = await this.paymentStripeService.createSession(
      createSubscriptionDto,
      user.email,
      user.userName,
      user.id,
    );
    //create subscription with payment with status pending
    const { subscription, payment } = businessAccount.createSubscription(createSubscriptionDto, session.id);
    //save business account with subscription and payment
    await this.subscriptionsRepository.saveSubscription(subscription, payment, businessAccount);
    //return session url
    return session.url;
  }
}
