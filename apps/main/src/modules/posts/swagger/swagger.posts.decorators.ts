import { applyDecorators } from '@nestjs/common';
import { ApiErrorResultDto } from '@common/main/validators/api-error-result.dto';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { PostViewModel } from '../api/view-models/post-view.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Create a new post with upload modules
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
 * Delete modules for post by postId and uploadId, when post is published
 * @constructor
 */
export function SwaggerDecoratorsByDeleteImagePost(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete modules for post by postId and uploadId, when post is published',
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

export function SwaggerDecoratorsByGetPost(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Get post by id',
    }),
    ApiResponse({
      status: HTTP_Status.OK_200,
      description: 'The post has been successfully found. The response body contains the post data',
      type: PostViewModel,
    }),
    ApiResponse({
      status: HTTP_Status.NOT_FOUND_404,
      description: 'The post has not been found',
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}

export function SwaggerDecoratorsByDeletePost(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete post by id',
    }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'The post has been successfully deleted',
    }),
    ApiResponse({
      status: HTTP_Status.NOT_FOUND_404,
      description: 'The post has not been found',
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
    ApiResponse({ status: HTTP_Status.FORBIDDEN_403, description: 'Forbidden' }),
  );
}

export function SwaggerDecoratorsByUpdatePost(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Update post by id',
    }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'The post has been successfully updated',
    }),
    ApiResponse({
      status: HTTP_Status.NOT_FOUND_404,
      description: 'The post has not been found',
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
    ApiResponse({ status: HTTP_Status.FORBIDDEN_403, description: 'Forbidden' }),
  );
}

export function SwaggerDecoratorsByGetPosts(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Get posts with pagination' }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}

//deprecated
/*
export function SwaggerDecoratorsByUploadImagePost(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload image for future post',
    }),
    ApiResponse({
      status: HTTP_Status.CREATED_201,
      description:
        'Uploaded image information object. Return array with Must contain medium photo size (_______) and thumbnail photo size (________)',

      type: UploadedImageViewModel,
    }),
    ApiResponse({
      status: HTTP_Status.BAD_REQUEST_400,
      description: 'The inputModel has incorrect values',
      type: ApiErrorResultDto,
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
  );
}

export function SwaggerDecoratorsByDeleteImagePosts(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete modules for post by uploadId, when user not create post',
    }),
    ApiResponse({
      status: HTTP_Status.NO_CONTENT_204,
      description: 'The image post has been successfully deleted',
    }),
    ApiResponse({
      status: HTTP_Status.NOT_FOUND_404,
      description: 'The post has not been found',
    }),
    ApiResponse({ status: HTTP_Status.UNAUTHORIZED_401, description: 'Unauthorized' }),
    ApiResponse({ status: HTTP_Status.FORBIDDEN_403, description: 'Forbidden' }),
  );
}

export function SwaggerDecoratorsByCreatePost(): MethodDecorator {
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
  );
}*/
