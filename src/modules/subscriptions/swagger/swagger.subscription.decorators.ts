import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { SubscriptionPriceViewModel } from '../api/view-model/cost-monthly-subscription-view.dto';
import { ApiErrorResultDto } from '../../../main/validators/api-error-result.dto';
import { CurrentSubscriptionViewModel } from '../api/view-model/current-subscription-view.dto';
import { PaymentSessionUrlViewModel } from '../api/view-model/payment-session-url-view-view.dto';
import { PaymentsViewModel } from '../api/view-model/payments-view.dto';

/**
 * Get cost of subscription
 * @constructor
 */
export function SwaggerDecoratorsGetCostOfSubscription(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get cost of subscription' }),
    ApiResponse({
      status: HTTP_Status.OK_200,
      description: 'Get cost of subscription',
      type: SubscriptionPriceViewModel,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}

/**
 * Create subscription
 * @constructor
 */
export function SwaggerDecoratorsByCreateSubscription(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Create subscription' }),
    ApiResponse({
      status: HTTP_Status.CREATED_201,
      description: 'The subscription has been successfully created with status pending, need to pay',
      type: PaymentSessionUrlViewModel,
    }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'The inputModel has incorrect values',
      type: ApiErrorResultDto,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}

/**
 * Get current subscription
 * @constructor
 */
export function SwaggerDecoratorsByGetCurrentSubscription(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get current subscription' }),
    ApiResponse({
      status: HTTP_Status.OK_200,
      description: 'Get current subscription',
      type: CurrentSubscriptionViewModel,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
    ApiResponse({ status: HTTP_Status.NOT_FOUND_404, description: 'Not found' }),
  );
}

/**
 * Get payments
 * @constructor
 */
export function SwaggerDecoratorsByGetPayments(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get payments' }),
    ApiResponse({ status: HTTP_Status.OK_200, description: 'Get payments', type: [PaymentsViewModel] }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}
