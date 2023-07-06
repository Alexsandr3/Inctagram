import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { CreateSessionInputDto } from '@payments-ms/modules/payment/api/input-dto/create-session-input.dto';
import { PaymentGateway } from '@payments-ms/modules/payment/payment-gateway';
import { IPaymentsRepository } from '@payments-ms/modules/payment/infrastructure/payments.repository';
import { Payment } from '@payments-ms/modules/payment/domain/payment.entity';
import { SessionViewModel } from '@payments-ms/modules/payment/api/view-model/session-view.dto';

export class CreateSessionCommand {
  constructor(public readonly createSubscriptionDto: CreateSessionInputDto) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase
  extends BaseNotificationUseCase<CreateSessionCommand, SessionViewModel>
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly paymentsRepository: IPaymentsRepository,
  ) {
    super();
  }

  /**
   * Create session for user to pay
   * @param command
   */
  async executeUseCase(command: CreateSessionCommand): Promise<SessionViewModel> {
    const { customerId, subscriptionInputData, userName, email } = command.createSubscriptionDto;
    //create session
    const { customer, id, url } = await this.paymentGateway.createSession({
      customerId: customerId,
      email: email,
      userName: userName,
      subscriptionInputData: subscriptionInputData,
    });
    //create payment
    const payment = Payment.create(id, subscriptionInputData.amount);

    await this.paymentsRepository.save(payment);

    return { customer, id, url };
  }
}
