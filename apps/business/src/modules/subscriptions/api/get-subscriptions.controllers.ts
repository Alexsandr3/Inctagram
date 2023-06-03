import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { SubscriptionPriceViewModel } from './view-model/cost-monthly-subscription-view.dto';
import { SwaggerDecoratorsGetCostOfSubscription } from '../swagger/swagger.subscription.decorators';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class GetSubscriptionsController {
  constructor(private readonly apiConfigService: ApiConfigService) {}

  @SwaggerDecoratorsGetCostOfSubscription()
  @Get('cost-of-Clients')
  @HttpCode(HTTP_Status.OK_200)
  async getCurrentCostSubscription(): Promise<SubscriptionPriceViewModel> {
    return new SubscriptionPriceViewModel(this.apiConfigService.COST_SUBSCRIPTION);
  }
}
