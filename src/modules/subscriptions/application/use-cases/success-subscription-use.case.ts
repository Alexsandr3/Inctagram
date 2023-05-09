import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { PaymentService } from '../../../../providers/payment/application/payment.service';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';

export class SuccessSubscriptionCommand {
  constructor(public readonly userId: number, public readonly sessionId: string) {}
}

@CommandHandler(SuccessSubscriptionCommand)
export class SuccessSubscriptionUseCase
  extends BaseNotificationUseCase<SuccessSubscriptionCommand, string>
  implements ICommandHandler<SuccessSubscriptionCommand>
{
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly paymentService: PaymentService,
    private readonly subscriptionsRepository: ISubscriptionsRepository,
  ) {
    super();
  }

  async executeUseCase(command: SuccessSubscriptionCommand): Promise<string> {
    const { userId, sessionId } = command;
    //find user
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    //find payment
    const payment = await this.subscriptionsRepository.getPayment(sessionId);
    return 'success';
  }
}
