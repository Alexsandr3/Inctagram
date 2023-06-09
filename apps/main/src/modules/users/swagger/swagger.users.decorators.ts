import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiErrorResultDto } from '@common/main/validators/api-error-result.dto';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { ProfileViewModel } from '../api/view-models/profile-view.dto';
import { AvatarsViewModel } from '../api/view-models/avatars-view.dto';

/**
 * @description Swagger decorators for upload image avatar
 * @constructor
 */
export function SwaggerDecoratorsByUploadPhotoAvatar(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload providers square image for Avatar profile (.png or jpg (jpeg) file',
    }),
    ApiResponse({
      status: HTTP_Status.CREATED_201,
      description:
        'Uploaded image information object. Return array with Must contain medium photo size (192x192) and thumbnail photo size (45x45)',
      type: AvatarsViewModel,
    }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'The inputModel has incorrect values',
      type: ApiErrorResultDto,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}

export function SwaggerDecoratorsByDeletePhotoAvatar(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete providers square image for Avatar profile',
    }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'Success deleted avatar',
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}

/**
 * @description Swagger decorators for get profile
 * @constructor
 */
export function SwaggerDecoratorsByGetProfile(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get profile for user by id from query params' }),
    ApiResponse({
      status: HTTP_Status.OK_200,
      description: 'Get profile information object',
      type: ProfileViewModel,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}

/**
 * @description Swagger decorators for update profile
 * @constructor
 */
export function SwaggerDecoratorsByUpdateProfile(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Update profile for user' }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'Updated profile information object',
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
 * @description Swagger decorators for form data
 * @constructor
 */
export function SwaggerDecoratorsByFormData(): MethodDecorator {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            // 👈 this property
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}
