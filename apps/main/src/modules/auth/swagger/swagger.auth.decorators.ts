import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { ApiErrorResultDto } from '@common/main/validators/api-error-result.dto';
import { PasswordRecoveryViewDto } from '../api/view-dto/password-recovery-view.dto';
import { MeViewDto } from '../api/view-dto/me.view.dto';
import { TokenTypeSwaggerDto } from '@common/configuration/swagger/helpers/token-type-swagger.dto';

export function SwaggerDecoratorsByRegistration(): MethodDecorator {
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
    ApiResponse({
      status: HTTP_Status.TOO_MANY_REQUESTS_429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
export function SwaggerDecoratorsByConfirmationRegistration(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Confirm registration' }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'Email was verified. Account was activated',
    }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'Incorrect input data',
      type: ApiErrorResultDto,
    }),
    ApiResponse({
      status: HTTP_Status.TOO_MANY_REQUESTS_429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
export function SwaggerDecoratorsByConfirmAddingExternalAccount(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Confirm adding external account' }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'Email was verified. Account was added. User is authorized',
      type: TokenTypeSwaggerDto,
    }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'Incorrect input data',
      type: ApiErrorResultDto,
    }),
    ApiResponse({
      status: HTTP_Status.TOO_MANY_REQUESTS_429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
export function SwaggerDecoratorsByRejectAddingExternalAccount(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Reject adding external account' }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'Adding account was rejected',
    }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'Incorrect input data',
      type: ApiErrorResultDto,
    }),
    ApiResponse({
      status: HTTP_Status.TOO_MANY_REQUESTS_429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
export function SwaggerDecoratorsByRegistrationEmailResending(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend confirmation registration Email if user exists',
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
    ApiResponse({
      status: HTTP_Status.TOO_MANY_REQUESTS_429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
export function SwaggerDecoratorsByLogin(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Try login user to the system' }),
    ApiResponse({
      status: HTTP_Status.OK_200,
      description: 'success',
      type: TokenTypeSwaggerDto,
    }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'Incorrect input data',
      type: ApiErrorResultDto,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
    ApiResponse({
      status: HTTP_Status.TOO_MANY_REQUESTS_429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
export function SwaggerDecoratorsByPasswordRecovery(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside',
    }),
    ApiResponse({ status: HTTP_Status.NO_CONTENT_204, description: 'success' }),
    ApiResponse({ status: HTTP_Status.BAD_REQUEST_400, description: 'Incorrect input data by field or reCaptcha' }),
  );
}
export function SwaggerDecoratorsByCheckPasswordRecovery(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Check recovery code for valid' }),
    ApiResponse({ status: HTTP_Status.OK_200, description: 'Recovery code is valid', type: PasswordRecoveryViewDto }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'If the recovery code is incorrect, expired or already been applied',
    }),
    ApiResponse({
      status: HTTP_Status.TOO_MANY_REQUESTS_429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
export function SwaggerDecoratorsByNewPassword(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Confirm Password recovery' }),
    ApiResponse({ status: HTTP_Status.NO_CONTENT_204, description: 'success' }),
    ApiResponse({ status: HTTP_Status.BAD_REQUEST_400, description: 'Incorrect input data by field' }),
    ApiResponse({
      status: HTTP_Status.TOO_MANY_REQUESTS_429,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
export function SwaggerDecoratorsByLogout(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'In cookie client must send correct refresh Token that will be revoked',
    }),
    ApiResponse({ status: HTTP_Status.NO_CONTENT_204, description: 'success' }),
    ApiResponse({
      status: HTTP_Status.UNAUTHORIZED_401,
      description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}
export function SwaggerDecoratorsByMe(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Get information about current user',
    }),
    ApiResponse({ status: HTTP_Status.OK_200, description: 'success', type: MeViewDto }),
    ApiResponse({
      status: HTTP_Status.UNAUTHORIZED_401,
      description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
    ApiBearerAuth(),
  );
}
export function SwaggerDecoratorsByUpdateTokens(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary:
        " 'Generate new pair of access and refresh tokens (in cookie client must send correct refresh Token that will be revoked after refreshing) Device LastActiveDate should\\n' +\n" +
        "'be overrode by issued Date of new refresh token',",
    }),
    ApiResponse({
      status: 200,
      description: 'success',
      type: TokenTypeSwaggerDto,
    }),
    ApiResponse({
      status: 401,
      description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}
