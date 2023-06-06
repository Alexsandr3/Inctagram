import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CreateSessionInputDto } from '@payments-ms/modules/payment/api/input-dto/create-session-input.dto';
import { ResultNotification } from '@common/main/validators/result-notification';
import { CreatedSessionResponseInterface } from '@common/modules/ampq/ampq-contracts/queues/images/subscriptions.contract';
import { CreateSessionCommand } from '@payments-ms/modules/payment/application/use-cases/create-session-use.case';
import { SwaggerDecoratorsByCreateSession } from '@payments-ms/modules/payment/swagger/swagger.payment.decorators';
import { SessionViewModel } from '@payments-ms/modules/payment/api/view-model/session-view.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly commandBus: CommandBus) {}

  @SwaggerDecoratorsByCreateSession()
  @Post()
  @HttpCode(201)
  async stripeHook(@Body() inputData: CreateSessionInputDto): Promise<SessionViewModel> {
    const notification = await this.commandBus.execute<
      CreateSessionCommand,
      ResultNotification<CreatedSessionResponseInterface>
    >(new CreateSessionCommand(inputData));
    return notification.getData();
  }
}
