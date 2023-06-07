import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { ApiErrorResultDto } from '@common/main/validators/api-error-result.dto';
import { SessionViewModel } from '@payments-ms/modules/payment/api/view-model/session-view.dto';
import { Stripe } from 'stripe';

/**
 * Create session
 * @constructor
 */
export function SwaggerDecoratorsByCreateSession(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Create session' }),
    ApiResponse({
      status: HTTP_Status.CREATED_201,
      description: 'The session has been successfully created with status pending, need to pay',
      type: SessionViewModel,
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
 * Handle stripe webhook
 * @constructor
 */
export function SwaggerDecoratorsByWebHook(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Webhook for Stripe Api (see stripe official documentation)' }),
    ApiResponse({ status: HTTP_Status.NO_CONTENT_204, description: 'No content' }),
  );
}

/**
 * Find active subscriptions
 * @constructor
 */
export function SwaggerDecoratorsByFindActiveSubscriptions(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Find active subscriptions' }),
    ApiResponse({
      status: HTTP_Status.OK_200,
      description: 'The active subscriptions has been successfully found',
      // @ts-ignore
      type: Stripe.ApiListPromise<Stripe.Subscription>,
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
 * Cancel subscription
 * @constructor
 */
export function SwaggerDecoratorsByCancelSubscription(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Cancel subscription' }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'The subscription has been successfully canceled',
    }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'The inputModel has incorrect values',
      type: ApiErrorResultDto,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}
