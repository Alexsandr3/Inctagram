import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { TokenTypeSwaggerDto } from '../../../configuration/swagger/helpers/token-type-swagger.dto';
import { ApiErrorResultDto } from '../../../main/validators/api-error-result.dto';

export function SwaggerDecoratorsByGitHubAuthorization(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Redirect to github authorization' }),
    ApiResponse({
      status: HTTP_Status.OK_200,
      description: 'success',
    }),
  );
}

export function SwaggerDecoratorsByGitHubAuthorizationHandler(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Try login user to the system with github' }),
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

export function SwaggerDecoratorsByGitHubRegistration(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Redirect to github registration' }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'success',
    }),
  );
}

export function SwaggerDecoratorsByGitHubRegistrationHandler(): MethodDecorator {
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
