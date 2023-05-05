import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { TokenTypeSwaggerDto } from '../../../configuration/swagger/helpers/token-type-swagger.dto';
import { ApiErrorResultDto } from '../../../main/validators/api-error-result.dto';

/**
 * @description Swagger decorators redirect to google authorization
 * @constructor
 */
export function SwaggerDecoratorsByGoogleAuthorization(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Redirect to google authorization' }),
    ApiResponse({ status: HTTP_Status.OK_200, description: 'success' }),
  );
}

/**
 * @description Swagger decorators login user to the system with Google account
 * @constructor
 */
export function SwaggerDecoratorsByGoogleAuthorizationHandler(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Try login user to the system with google' }),
    ApiResponse({
      status: HTTP_Status.OK_200,
      description: 'success, return access token (body) and refresh token(cookie)',
      type: TokenTypeSwaggerDto,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
    ApiResponse({
      status: HTTP_Status.TOO_MANY_REQUESTS_429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}

/**
 * @description Swagger decorators redirect to google registration
 * @constructor
 */
export function SwaggerDecoratorsByGoogleRegistration(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Redirect to google registration' }),
    ApiResponse({ status: HTTP_Status.OK_200, description: 'success' }),
  );
}

/**
 * @description Swagger decorators registration in the system. An email with a confirmation code will be sent to the specified email address
 * @constructor
 */
export function SwaggerDecoratorsByGoogleRegistrationHandler(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Registration in the system. Email with confirmation code will be send to passed email address',
    }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'An email with a verification code has been sent to the specified email address',
    }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'Incorrect input data',
      type: ApiErrorResultDto,
    }),
  );
}
