import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiErrorResultDto } from '../../../main/validators/api-error-result.dto';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { PostViewModel } from '../api/view-models/post-view.dto';

/**
 * Create a new post with upload images
 * @constructor
 */
export function SwaggerDecoratorsByCreatePostWithUploadImages(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new post',
    }),
    ApiResponse({
      status: HTTP_Status.CREATED_201,
      description: 'The post has been successfully created. The response body contains the post data',
      type: PostViewModel,
    }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'The inputModel has incorrect values',
      type: ApiErrorResultDto,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
    ApiResponse({
      status: HTTP_Status.NOT_FOUND_404,
      description: 'The post has not been found',
    }),
  );
}

/**
 * Delete images for post by postId and uploadId, when post is published
 * @constructor
 */
export function SwaggerDecoratorsByDeleteImagePost(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete images for post by postId and uploadId, when post is published',
    }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'The image post has been successfully deleted',
    }),
    ApiResponse({
      status: HTTP_Status.NOT_FOUND_404,
      description: 'The post has not been found',
    }),
    ApiResponse({ status: HTTP_Status.BAD_REQUEST_400, description: 'Post must have at least one image' }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
    ApiResponse({ status: HTTP_Status.FORBIDDEN_403, description: 'Forbidden' }),
  );
}

/**
 * Multiple file upload with Express and Swagger
 * @constructor
 */
export function SwaggerDecoratorsByFormDataForArrayFileWith(): MethodDecorator {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          description: { type: 'string' },
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
