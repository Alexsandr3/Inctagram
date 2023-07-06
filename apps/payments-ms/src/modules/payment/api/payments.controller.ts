import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CreateSessionInputDto } from '@payments-ms/modules/payment/api/input-dto/create-session-input.dto';
import { NotificationException, ResultNotification } from '@common/main/validators/result-notification';
import { CreateSessionCommand } from '@payments-ms/modules/payment/application/use-cases/create-session-use.case';
import {
  SwaggerDecoratorsByCancelSubscription,
  SwaggerDecoratorsByCreateSession,
  SwaggerDecoratorsByFindActiveSubscriptions,
} from '@payments-ms/modules/payment/swagger/swagger.payment.decorators';
import { SessionViewModel } from '@payments-ms/modules/payment/api/view-model/session-view.dto';
import { PaymentStripeService } from '@payments-ms/modules/payment/application/payment-stripe.service';
import { NotificationCode } from '@common/configuration/notificationCode';
import { NotificationErrors } from '@common/main/validators/checker-notification.errors';
import { Stripe } from 'stripe';
import { HTTP_Status } from '@common/main/enums/http-status.enum';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly commandBus: CommandBus, private readonly paymentService: PaymentStripeService) {}

  @SwaggerDecoratorsByCreateSession()
  @Post()
  @HttpCode(HTTP_Status.CREATED_201)
  async createSession(@Body() inputData: CreateSessionInputDto): Promise<SessionViewModel> {
    const notification = await this.commandBus.execute<CreateSessionCommand, ResultNotification<SessionViewModel>>(
      new CreateSessionCommand(inputData),
    );
    return notification.getData();
  }

  @SwaggerDecoratorsByFindActiveSubscriptions()
  @Get('subscriptions/:id')
  @HttpCode(HTTP_Status.OK_200)
  async findActiveSubscriptions(@Param('id') id: string): Promise<Stripe.ApiListPromise<Stripe.Subscription>> {
    const activeSubscription = await this.paymentService.findSubscriptions(id);
    if (!activeSubscription) {
      const notification = new ResultNotification<Stripe.ApiListPromise<Stripe.Subscription>>();
      notification.addErrorFromNotificationException(
        new NotificationException(`Not found active subscription`, 'subscription', NotificationCode.NOT_FOUND),
      );
      throw new NotificationErrors(notification);
    }
    return activeSubscription;
  }

  @SwaggerDecoratorsByCancelSubscription()
  @Delete('subscriptions/:id')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async cancelSubscription(@Param('id') id: string): Promise<void> {
    const canceledSubscription = await this.paymentService.cancelSubscription(id);
    if (!canceledSubscription) {
      const notification = new ResultNotification<Stripe.Subscription>();
      notification.addErrorFromNotificationException(
        new NotificationException(`Not found subscription`, 'subscription', NotificationCode.NOT_FOUND),
      );
      throw new NotificationErrors(notification);
    }
    return;
  }
}
