import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { DevicesViewModel } from '../api/session.view.dto';

/**
 * SwaggerDecoratorsByGetUserSessions
 * @constructor
 */
export function SwaggerDecoratorsByGetUserSessions() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user sessions',
    }),
    ApiResponse({
      status: HTTP_Status.OK_200,
      description: 'The user sessions have been successfully retrieved',
      type: DevicesViewModel,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}

/**
 * SwaggerDecoratorsByDeleteSelectedSession
 * @constructor
 */
export function SwaggerDecoratorsByDeleteSelectedSession() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete selected device',
    }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'The session has been successfully deleted',
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
    ApiResponse({ status: HTTP_Status.FORBIDDEN_403, description: 'Forbidden' }),
  );
}

/**
 * SwaggerDecoratorsByDeleteAllSessionsExceptCurrent
 * @constructor
 */
export function SwaggerDecoratorsByDeleteAllSessionsExceptCurrent() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete all sessions except current',
    }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'The sessions have been successfully deleted',
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
    ApiResponse({ status: HTTP_Status.FORBIDDEN_403, description: 'Forbidden' }),
  );
}
