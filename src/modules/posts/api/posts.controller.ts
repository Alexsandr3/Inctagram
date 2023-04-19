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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { ValidationTypeImagePipe } from '../../../main/validators/validation-type-image.pipe';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { CreatePostInputDto } from './input-dto/create-post.input.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  SwaggerDecoratorsByCreatePost,
  SwaggerDecoratorsByDeleteImagePost,
  SwaggerDecoratorsByDeletePost,
  SwaggerDecoratorsByGetPost,
  SwaggerDecoratorsByUpdatePost,
  SwaggerDecoratorsByUploadImagePost,
} from '../swagger.posts.decorators';
import { SwaggerDecoratorsByFormData } from '../../users/swagger.users.decorators';
import { UpdatePostInputDto } from './input-dto/update-post.input.dto';
import { UploadImagePostCommand } from '../application/use-cases/upload-image-post-use.case';
import { NotificationException, ResultNotification } from '../../../main/validators/result-notification';
import { typeImagePost } from '../default-options-for-validate-images-post';
import { IPostsQueryRepository } from '../infrastructure/posts-query.repository';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostImageViewModel } from './view-models/post-image-view.dto';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';
import { CreatePostCommand } from '../application/use-cases/create-post-use.case';
import { DeleteImagePostCommand } from '../application/use-cases/delete-image-post-use.case';
import { PostViewModel } from './view-models/post-view.dto';
import { ProfileViewModel } from '../../users/api/view-models/profile-view.dto';
import { NotificationCode } from '../../../configuration/exception.filter';
import { CheckerNotificationErrors } from '../../../main/validators/checker-notification.errors';
import { DeletePostCommand } from '../application/use-cases/delete-post-use.case';
import { PostStatus } from '../domain/post.entity';
import { UpdatePostCommand } from '../application/use-cases/update-post-use.case';

@ApiBearerAuth()
@ApiTags('Posts')
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly commandBus: CommandBus, private readonly postsQueryRepository: IPostsQueryRepository) {}

  @SwaggerDecoratorsByUploadImagePost()
  @SwaggerDecoratorsByFormData()
  @Post(`/image`)
  @HttpCode(HTTP_Status.CREATED_201)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImagePost(
    @CurrentUserId() userId: number,
    @UploadedFile(new ValidationTypeImagePipe(typeImagePost))
    file: Express.Multer.File,
  ): Promise<PostImageViewModel> {
    const notification = await this.commandBus.execute<
      UploadImagePostCommand,
      ResultNotification<{ fieldId: string }[]>
    >(new UploadImagePostCommand(userId, file.mimetype, file.buffer));
    return this.postsQueryRepository.getUploadImages(notification.getData()[0].fieldId);
  }

  @SwaggerDecoratorsByCreatePost()
  @Post()
  @HttpCode(HTTP_Status.CREATED_201)
  async createPost(@CurrentUserId() userId: number, @Body() body: CreatePostInputDto): Promise<PostViewModel> {
    const notification = await this.commandBus.execute<CreatePostCommand, ResultNotification<number>>(
      new CreatePostCommand(userId, body.description, body.childrenMetadata),
    );
    return this.postsQueryRepository.getPost(notification.getData(), PostStatus.PUBLISHED);
  }

  @SwaggerDecoratorsByDeleteImagePost()
  @Delete('/image/:uploadId')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async deleteImagePost(@CurrentUserId() userId: number, @Param('uploadId', ParseIntPipe) uploadId: number) {
    await this.commandBus.execute<DeleteImagePostCommand, ResultNotification>(
      new DeleteImagePostCommand(userId, uploadId),
    );
  }

  @SwaggerDecoratorsByGetPost()
  @Get('/:postId')
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
      throw new CheckerNotificationErrors('Error', notification);
    }
    return foundPost;
  }

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

  @SwaggerDecoratorsByDeletePost()
  @Delete('/:postId')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async deletePost(@CurrentUserId() userId: number, @Param('postId', ParseIntPipe) postId: number): Promise<void> {
    await this.commandBus.execute<DeletePostCommand, ResultNotification>(new DeletePostCommand({ userId, postId }));
  }
}
