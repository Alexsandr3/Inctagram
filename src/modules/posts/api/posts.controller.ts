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
  UploadedFiles,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { ValidationTypeImagePipe } from '../../../main/validators/validation-type-image.pipe';
import { typeImageAvatar } from '../../users/default-options-for-validate-images';
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
import { UploadImagePostCommand } from '../aplication/upload-image-post-use.case';
import { ResultNotification } from '../../../main/validators/result-notification';

// const imageFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   callback: (error: Error, acceptFile: boolean) => void,
// ) => {
//   console.log(file.mimetype, 'file.mimetype');
//   if (!Boolean(file.mimetype.match(/(jpg|jpeg|png|gif)/))) callback(null, false);
//   callback(null, true);
// };
// export const imageOptions: MulterOptions = {
//   limits: { fileSize: 5242880 },
//   fileFilter: imageFilter,
// };

@ApiBearerAuth()
@ApiTags('Posts')
// @UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly commandBus: CommandBus) {}

  @SwaggerDecoratorsByUploadImagePost()
  @SwaggerDecoratorsByFormData()
  @Post(`/image`)
  @HttpCode(HTTP_Status.CREATED_201)
  async uploadImagePost(
    @CurrentUserId() userId: number,
    @UploadedFiles(new ValidationTypeImagePipe(typeImageAvatar))
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const notification = await this.commandBus.execute<UploadImagePostCommand, ResultNotification<null>>(
      new UploadImagePostCommand(userId, file.mimetype, file.buffer),
    );
    return notification.getData();
  }

  @SwaggerDecoratorsByDeleteImagePost()
  @Delete('/image/:uploadId')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async deleteImagePost(@CurrentUserId() userId: number, @Param('uploadId', ParseIntPipe) uploadId: number) {}

  @SwaggerDecoratorsByCreatePost()
  @Post()
  @HttpCode(HTTP_Status.CREATED_201)
  async createPost(@CurrentUserId() userId: number, @Body() body: CreatePostInputDto) {
    // const notification = await this.commandBus.execute<CreatePostCommand, ResultNotification<null>>(
    //   new CreatePostCommand(userId, body.description, body.childrenMetadata),
    // );
    // return notification.getData();
  }

  @SwaggerDecoratorsByGetPost()
  @Get('/:postId')
  @HttpCode(HTTP_Status.OK_200)
  async getPost(@CurrentUserId() userId: number, @Param('postId') postId: number) {}

  @SwaggerDecoratorsByDeletePost()
  @Put('/:postId')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async updatePost(
    @Param('postId') postId: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdatePostInputDto,
    @UploadedFile(new ValidationTypeImagePipe(typeImageAvatar))
    file: Express.Multer.File,
  ) {}

  @SwaggerDecoratorsByUpdatePost()
  @Delete('/:postId')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async deletePost(@CurrentUserId() userId: number, @Param('postId') postId: number) {}
}
