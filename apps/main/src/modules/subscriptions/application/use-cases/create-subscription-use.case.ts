import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { NotificationException } from '@common/main/validators/result-notification';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { CreateSubscriptionInputDto } from '../../api/input-dtos/create-subscription-input.dto';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';
import { NotificationCode } from '@common/configuration/notificationCode';
import { ClientPaymentsService } from '../../../Clients/client-payments-service';
import { CreatedSessionResponseInterface } from '@common/main/types/created-session-response-interface.type';

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
    private readonly subscriptionsRepository: ISubscriptionsRepository,
    private readonly clientPaymentService: ClientPaymentsService,
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
    //check if user has active  payments-ms account
    const businessAccount = await this.subscriptionsRepository.findBusinessAccountByUserId(userId);
    //send data to another microservice to create session and return session, id, url
    const { customer, id, url } = await this.clientPaymentService.createSession<CreatedSessionResponseInterface>({
      customerId: businessAccount.stipeCustomerId,
      email: user.email,
      userName: user.userName,
      subscriptionInputData: createSubscriptionDto,
    });
    //update payments-ms account with new subscription
    businessAccount.updateCurrentSubscriptionAndAddNewSubscriptionWithPayment(
      id,
      customer as string,
      createSubscriptionDto,
    );
    //save payments-ms account with subscription and payment
    await this.subscriptionsRepository.updateBusinessAccountWithSubscriptionAndPayment(businessAccount);
    //return session url
    return url;
  }
}
