import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '../../../main/validators/result-notification';
import { CreateSubscriptionInputDto } from './input-dtos/create-subscription-input.dto';
import { CreateSubscriptionCommand } from '../application/use-cases/create-subscription-use.case';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import {
  SwaggerDecoratorsByCancelAutoRenewal,
  SwaggerDecoratorsByCreateSubscription,
  SwaggerDecoratorsByGetCurrentSubscription,
  SwaggerDecoratorsByGetPayments,
} from '../swagger/swagger.subscription.decorators';
import { ISubscriptionsQueryRepository } from '../infrastructure/subscriptions-query.repository';
import { PaymentsViewModel } from './view-model/payments-view.dto';
import { PaymentSessionUrlViewModel } from './view-model/payment-session-url-view-view.dto';
import { CanceledAutoRenewalCommand } from '../application/use-cases/canceled-auto-renewal-use.case';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';
import { CurrentActiveSubscriptionsViewModel } from './view-model/current-subscriptions-view.dto';

@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly subscriptionsQueryRepository: ISubscriptionsQueryRepository,
  ) {}

  @SwaggerDecoratorsByCreateSubscription()
  @Post()
  @HttpCode(HTTP_Status.CREATED_201)
  async createSubscription(
    @CurrentUserId() userId: number,
    @Body() createSubscriptionDto: CreateSubscriptionInputDto,
    // @Res({ passthrough: true }) res: Response,
  ): Promise<PaymentSessionUrlViewModel> {
    const notification = await this.commandBus.execute<CreateSubscriptionCommand, ResultNotification<string>>(
      new CreateSubscriptionCommand(userId, createSubscriptionDto),
    );
    return new PaymentSessionUrlViewModel(notification.getData());
    // res.redirect(notification.getData());
  }

  @SwaggerDecoratorsByGetCurrentSubscription()
  @Get('current-subscriptions')
  @HttpCode(HTTP_Status.OK_200)
  async getCurrentSubscription(@CurrentUserId() userId: number): Promise<CurrentActiveSubscriptionsViewModel> {
    return this.subscriptionsQueryRepository.getCurrentSubscriptions(userId);
  }

  @SwaggerDecoratorsByGetPayments()
  @Get('my-payments')
  @HttpCode(HTTP_Status.OK_200)
  async getMyPayments(@CurrentUserId() userId: number): Promise<PaymentsViewModel[]> {
    return await this.subscriptionsQueryRepository.getMyPayments(userId);
  }

  @SwaggerDecoratorsByCancelAutoRenewal()
  @Post('canceled-auto-renewal')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async canceledAutoRenewal(@CurrentUserId() userId: number): Promise<void> {
    await this.commandBus.execute<CanceledAutoRenewalCommand, ResultNotification<void>>(
      new CanceledAutoRenewalCommand(userId),
    );
  }
}
