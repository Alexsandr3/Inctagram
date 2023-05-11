import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { NotificationException, ResultNotification } from '../../../main/validators/result-notification';
import { CreateSubscriptionInputDto } from './input-dtos/create-subscription-input.dto';
import { CreateSubscriptionCommand } from '../application/use-cases/create-subscription-use.case';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { ApiConfigService } from '../../api-config/api.config.service';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { PaymentSessionUrlViewModel } from './view-model/payment-session-url-view-view.dto';
import { SubscriptionPriceViewModel } from './view-model/cost-monthly-subscription-view.dto';
import {
  SwaggerDecoratorsByCreateSubscription,
  SwaggerDecoratorsByGetCurrentSubscription,
  SwaggerDecoratorsByGetPayments,
  SwaggerDecoratorsGetCostOfSubscription,
} from '../swagger/swagger.subscription.decorators';
import { ISubscriptionsQueryRepository } from '../infrastructure/subscriptions-query.repository';
import { ProfileViewModel } from '../../users/api/view-models/profile-view.dto';
import { NotificationCode } from '../../../configuration/exception.filter';
import { CheckerNotificationErrors } from '../../../main/validators/checker-notification.errors';
import { CurrentSubscriptionViewModel } from './view-model/current-subscription-view.dto';
import { PaymentsViewModel } from './view-model/payments-view.dto';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';

@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly apiConfigService: ApiConfigService,
    private readonly subscriptionsQueryRepository: ISubscriptionsQueryRepository,
  ) {}

  @SwaggerDecoratorsGetCostOfSubscription()
  @Get('cost-of-subscriptions')
  @HttpCode(HTTP_Status.OK_200)
  async getCurrentCostSubscription(@CurrentUserId() userId: number): Promise<SubscriptionPriceViewModel> {
    return new SubscriptionPriceViewModel(this.apiConfigService.COST_SUBSCRIPTION);
  }

  @SwaggerDecoratorsByCreateSubscription()
  @Post()
  @HttpCode(HTTP_Status.CREATED_201)
  async createSubscription(
    @CurrentUserId() userId: number,
    @Body() createSubscriptionDto: CreateSubscriptionInputDto,
    @Res() res,
  ): Promise<PaymentSessionUrlViewModel> {
    const notification = await this.commandBus.execute<CreateSubscriptionCommand, ResultNotification<string>>(
      new CreateSubscriptionCommand(userId, createSubscriptionDto),
    );
    // return new PaymentSessionUrlViewModel(notification.getData());
    return res.redirect(notification.getData());
  }

  @SwaggerDecoratorsByGetCurrentSubscription()
  @Get('current-subscription')
  @HttpCode(HTTP_Status.OK_200)
  async getCurrentSubscription(@CurrentUserId() userId: number): Promise<CurrentSubscriptionViewModel> {
    const subscription = await this.subscriptionsQueryRepository.getCurrentSubscription(userId);
    if (!subscription) {
      const notification = new ResultNotification<ProfileViewModel>();
      notification.addErrorFromNotificationException(
        new NotificationException(`Subscription not found`, 'subscription', NotificationCode.NOT_FOUND),
      );
      throw new CheckerNotificationErrors('Error', notification);
    }
    return subscription;
  }

  @SwaggerDecoratorsByGetPayments()
  @Get('my-payments')
  @HttpCode(HTTP_Status.OK_200)
  async getMyPayments(@CurrentUserId() userId: number): Promise<PaymentsViewModel[]> {
    return await this.subscriptionsQueryRepository.getMyPayments(userId);
  }
}
