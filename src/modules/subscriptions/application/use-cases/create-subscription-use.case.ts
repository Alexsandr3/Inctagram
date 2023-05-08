import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { CreateSubscriptionInputDto } from '../../api/input-dtos/create-subscription-input.dto';
import { PaymentService } from '../../../../providers/payment/application/payment.service';
import { BusinessAccountEntity } from '../../domain/business-account.entity';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';

export class CreateSubscriptionCommand {
  constructor(public readonly userId: number, public readonly createSubscriptionDto: CreateSubscriptionInputDto) {}
}

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionUseCase
  extends BaseNotificationUseCase<CreateSubscriptionCommand, any>
  implements ICommandHandler<CreateSubscriptionCommand>
{
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly paymentService: PaymentService,
    private readonly subscriptionsRepository: ISubscriptionsRepository,
  ) {
    super();
  }

  async executeUseCase(command: CreateSubscriptionCommand): Promise<any> {
    const { userId, createSubscriptionDto } = command;
    //find user
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    //check if user has business account and create if not
    if (!user.hasBusinessAccount) {
      const businessAccount = await BusinessAccountEntity.create(userId);
    }
    //find business account
    const businessAccount = await BusinessAccountEntity.create(userId);
    // const businessAccount = await this.subscriptionsRepository.findBusinessAccountByUserId(userId);
    //create subscription to business account
    const subscription = businessAccount.createSubscription(createSubscriptionDto);
    // create customer for future payments
    const customer = await this.paymentService.createCustomer(user.userName, user.email);
    //added stripe customer id to business account
    businessAccount.addStripeCustomerId(customer.id);
    //create
    const session = await this.paymentService.createPaymentToSubscription(customer.id, subscription);
    return session;
  }
}
