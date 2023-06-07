import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { ApiErrorResultDto } from '@common/main/validators/api-error-result.dto';
import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { ImageType } from '@common/main/entities/type/image.type';

/**
 * Swagger decorators for upload images
 * @constructor
 */
export function SwaggerDecoratorsByUploadImages(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Multiple file upload with Express and Swagger',
    }),
    ApiResponse({
      status: HTTP_Status.CREATED_201,
      description: 'The images has been successfully uploaded. The response body contains some data',
      type: [BaseImageEntity],
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
 * Swagger decorators for upload images
 * @constructor
 */
export function SwaggerDecoratorsByFormDataForArrayFileWith(): MethodDecorator {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          userId: { type: 'number' },
          type: { type: 'string', enum: [ImageType.POST, ImageType.AVATAR] },
          files: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  );
}

/**
 * Swagger decorators for delete images by urls
 * @constructor
 */
export function SwaggerDecoratorsByDeleteImagesByUrls(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete images by urls',
    }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'The images has been successfully deleted',
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}
