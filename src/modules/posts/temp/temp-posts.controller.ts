import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IPostsQueryRepository } from '../infrastructure/posts-query.repository';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TempCreatePostInputDto } from './temp-create-post.input.dto';
import { ValidationArrayImagePipe } from '../../../main/validators/validation-array-image.pipe';
import { typeImagePost } from '../default-options-for-validate-images-post';
import { TempCreatePostCommand } from './temp-create-post-use.case';
import { ResultNotification } from '../../../main/validators/result-notification';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';
import { PostStatus } from '../domain/post.entity';
import { TempDeleteImagePostCommand } from './temp-delete-image-post-use.case';

@ApiBearerAuth()
@ApiTags('Posts')
@UseGuards(JwtAuthGuard)
@Controller('test')
export class TempPostsController {
  constructor(private readonly commandBus: CommandBus, private readonly postsQueryRepository: IPostsQueryRepository) {}

  @Post(`posts/images`)
  @HttpCode(HTTP_Status.CREATED_201)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFilesWithPost(
    @CurrentUserId() userId: number,
    @UploadedFiles(new ValidationArrayImagePipe(typeImagePost))
    files: Express.Multer.File[],
    @Body() body: TempCreatePostInputDto,
  ) {
    const notification = await this.commandBus.execute<TempCreatePostCommand, ResultNotification<number>>(
      new TempCreatePostCommand(userId, files, body.description),
    );
    return this.postsQueryRepository.getPost(notification.getData(), PostStatus.PUBLISHED);
  }

  @Delete('posts/:postId/images/:uploadId')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async deleteImagePost(
    @CurrentUserId() userId: number,
    @Param('postId') postId: number,
    @Param('uploadId') uploadId: string,
  ) {
    await this.commandBus.execute<TempDeleteImagePostCommand, ResultNotification>(
      new TempDeleteImagePostCommand(userId, postId, uploadId),
    );
  }
}
