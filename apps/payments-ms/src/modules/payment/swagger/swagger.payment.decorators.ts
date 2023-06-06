import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { ApiErrorResultDto } from '@common/main/validators/api-error-result.dto';
import { SessionViewModel } from '@payments-ms/modules/payment/api/view-model/session-view.dto';

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
