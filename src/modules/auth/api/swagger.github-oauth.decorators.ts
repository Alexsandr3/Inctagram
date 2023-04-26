import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { TokenTypeSwaggerDto } from '../../../configuration/swagger/helpers/token-type-swagger.dto';

export function SwaggerDecoratorsByLoginWithGithub(): MethodDecorator {
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

export function SwaggerDecoratorsByAuthGithub(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Redirect to github auth' }),
    ApiResponse({
      status: HTTP_Status.OK_200,
      description: 'success',
    }),
  );
}
