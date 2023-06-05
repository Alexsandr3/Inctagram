import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUserId } from '@common/main/decorators/user.decorator';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  SwaggerDecoratorsByCreatePostWithUploadImages,
  SwaggerDecoratorsByDeleteImagePost,
  SwaggerDecoratorsByDeletePost,
  SwaggerDecoratorsByFormDataForArrayFileWith,
  SwaggerDecoratorsByGetPost,
  SwaggerDecoratorsByUpdatePost,
} from '../swagger/swagger.posts.decorators';
import { UpdatePostInputDto } from './input-dto/update-post.input.dto';
import { NotificationException, ResultNotification } from '@common/main/validators/result-notification';
import { typeImagePost } from '@common/main/config-for-validate-images/default-options-for-validate-images-post';
import { IPostsQueryRepository } from '../infrastructure/posts-query.repository';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';
import { PostViewModel } from './view-models/post-view.dto';
import { ProfileViewModel } from '../../users/api/view-models/profile-view.dto';
import { DeletePostCommand } from '../application/use-cases/delete-post-use.case';
import { UpdatePostCommand } from '../application/use-cases/update-post-use.case';
import { ValidationArrayImagePipe } from '@common/main/validators/validation-array-image.pipe';
import { CreatePostWithUploadImagesCommand } from '../application/use-cases/create-post-use.case';
import { DeleteImageExistingPostCommand } from '../application/use-cases/delete-image-post-use.case';
import { CreatePostInputDto } from './input-dto/create-post.input.dto';
import { NotificationErrors } from '@common/main/validators/checker-notification.errors';
import { NotificationCode } from '@common/configuration/notificationCode';
import { PostStatus } from '../types/post-status.type';

@ApiBearerAuth()
@ApiTags('Posts')
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly commandBus: CommandBus, private readonly postsQueryRepository: IPostsQueryRepository) {}

  /**
   * Create post with upload modules
   * @param userId
   * @param files
   * @param body
   */
  @SwaggerDecoratorsByCreatePostWithUploadImages()
  @SwaggerDecoratorsByFormDataForArrayFileWith()
  @Post()
  @HttpCode(HTTP_Status.CREATED_201)
  @UseInterceptors(FilesInterceptor('files'))
  async createPostWithUploadImages(
    @CurrentUserId() userId: number,
    @UploadedFiles(new ValidationArrayImagePipe(typeImagePost))
    files: Express.Multer.File[],
    @Body() body: CreatePostInputDto,
  ) {
    const notification = await this.commandBus.execute<CreatePostWithUploadImagesCommand, ResultNotification<number>>(
      new CreatePostWithUploadImagesCommand(userId, files, body.description),
    );
    return this.postsQueryRepository.getPost(notification.getData(), PostStatus.PUBLISHED);
  }

  /**
   * Delete image existing post by post id and upload id
   * @param userId
   * @param postId
   * @param uploadId
   */
  @SwaggerDecoratorsByDeleteImagePost()
  @Delete('/:postId/images-ms/:uploadId')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async deleteImageExistingPost(
    @CurrentUserId() userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('uploadId') uploadId: string,
  ) {
    await this.commandBus.execute<DeleteImageExistingPostCommand, ResultNotification>(
      new DeleteImageExistingPostCommand(userId, postId, uploadId),
    );
  }

  /**
   * Get post by id
   * @param userId
   * @param postId
   */
  @SwaggerDecoratorsByGetPost()
  @Get('/p/:postId')
  @HttpCode(HTTP_Status.OK_200)
  async getPost(
    @CurrentUserId() userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostViewModel> {
    const foundPost = await this.postsQueryRepository.getPost(postId, PostStatus.PUBLISHED);
    if (!foundPost) {
      const notification = new ResultNotification<ProfileViewModel>();
      notification.addErrorFromNotificationException(
        new NotificationException(`Post with id: ${postId} not found`, 'post', NotificationCode.NOT_FOUND),
      );
      throw new NotificationErrors(notification);
    }
    return foundPost;
  }

  /**
   * Update post by id
   * @param postId
   * @param userId
   * @param body
   */
  @SwaggerDecoratorsByUpdatePost()
  @Put('/:postId')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdatePostInputDto,
  ) {
    await this.commandBus.execute<UpdatePostCommand, ResultNotification>(
      new UpdatePostCommand({ userId, postId, body }),
    );
  }

  /**
   * Delete post by id
   * @param userId
   * @param postId
   */
  @SwaggerDecoratorsByDeletePost()
  @Delete('/:postId')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async deletePost(@CurrentUserId() userId: number, @Param('postId', ParseIntPipe) postId: number): Promise<void> {
    await this.commandBus.execute<DeletePostCommand, ResultNotification>(new DeletePostCommand({ userId, postId }));
  }
}

//deprecated
/*
  /!**
   * Upload image post
   * @param userId
   * @param file
   *!/
  @SwaggerDecoratorsByUploadImagePost()
  @SwaggerDecoratorsByFormData()
  @Post(`/image`)
  @HttpCode(HTTP_Status.CREATED_201)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImagePost(
    @CurrentUserId() userId: number,
    @UploadedFile(new ValidationImagePipe(typeImagePost))
    file: Express.Multer.File,
  ): Promise<UploadedImageViewModel> {
    const notification = await this.commandBus.execute<UploadImagePostCommand, ResultNotification<string>>(
      new UploadImagePostCommand(userId, file),
    );
    return this.postsQueryRepository.getUploadImages(notification.getData());
  }

  /!**
   * Create post
   * @param userId
   * @param body
   *!/
  @SwaggerDecoratorsByCreatePost()
  @Post()
  @HttpCode(HTTP_Status.CREATED_201)
  async createPost(@CurrentUserId() userId: number, @Body() body: CreatePostInputDto): Promise<PostViewModel> {
    const notification = await this.commandBus.execute<CreatePostCommand, ResultNotification<number>>(
      new CreatePostCommand(userId, body.description, body.childrenMetadata),
    );
    return this.postsQueryRepository.getPost(notification.getData(), PostStatus.PUBLISHED);
  }

  /!**
   * Delete image post
   * @param userId
   * @param uploadId
   *!/
  @SwaggerDecoratorsByDeleteImagePost()
  @Delete('/image/:uploadId')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async deleteImagePost(@CurrentUserId() userId: number, @Param('uploadId') uploadId: string) {
    await this.commandBus.execute<DeleteImagePostCommand, ResultNotification>(
      new DeleteImagePostCommand(userId, uploadId),
    );
  }*/
