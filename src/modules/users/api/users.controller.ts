import { Body, Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidationImagesPipe } from '../../../main/validators/validation-images.pipe';
import { optionsImageAvatar } from '../default-options-images';
import {
  SwaggerDecoratorsByCreateProfile,
  SwaggerDecoratorsByFormData,
  SwaggerDecoratorsByUploadPhotoAvatar,
} from '../swagger.users.decorators';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { UploadImageAvatarCommand } from '../aplication/use-cases/upload-image-avatar.use-case';
import { ResultNotification } from '../../../main/validators/result-notification';
import { CreateProfileCommand } from '../aplication/use-cases/create-profile.use-case';
import { CreateProfileInputDto } from './inpu-dto/create-profile.input.dto';
import { ProfileViewDto } from './view-models/profile-view.dto';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @SwaggerDecoratorsByCreateProfile()
  @Post('/profile/create')
  @HttpCode(HTTP_Status.CREATED_201)
  async createProfile(@CurrentUserId() userId: number, @Body() body: CreateProfileInputDto): Promise<ProfileViewDto> {
    const notification = await this.commandBus.execute<CreateProfileCommand, ResultNotification<ProfileViewDto>>(
      new CreateProfileCommand(userId, body),
    );
    return notification.getData();
  }

  /**
   * @description Upload photo avatar for user
   * @param userId
   * @param file
   */
  @SwaggerDecoratorsByUploadPhotoAvatar()
  @Post('/profile/avatar')
  @HttpCode(HTTP_Status.CREATED_201)
  @UseInterceptors(FileInterceptor('file'))
  @SwaggerDecoratorsByFormData()
  async uploadPhotoAvatar(
    @CurrentUserId() userId: number,
    @UploadedFile(new ValidationImagesPipe(optionsImageAvatar))
    file: Express.Multer.File,
  ) {
    const notification = await this.commandBus.execute<UploadImageAvatarCommand, ResultNotification<null>>(
      new UploadImageAvatarCommand(userId, file.mimetype, file.buffer),
    );
    return notification.getData();
  }
}
