import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { typeImageAvatar } from '../default-options-for-validate-images';
import {
  SwaggerDecoratorsByDeletePhotoAvatar,
  SwaggerDecoratorsByFormData,
  SwaggerDecoratorsByGetProfile,
  SwaggerDecoratorsByUpdateProfile,
  SwaggerDecoratorsByUploadPhotoAvatar,
} from '../swagger/swagger.users.decorators';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { CurrentUserId } from '@common/main/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { UploadImageAvatarCommand } from '../application/use-cases/upload-image-avatar.use-case';
import { NotificationException, ResultNotification } from '@common/main/validators/result-notification';
import { UpdateProfileInputDto } from './inpu-dto/update-profile.input.dto';
import { ProfileViewModel } from './view-models/profile-view.dto';
import { JwtAuthGuard } from '@common/main/strategies/jwt-auth.guard';
import { UpdateProfileCommand } from '../application/use-cases/update-profile.use-case';
import { ValidationImagePipe } from '@common/main/validators/validation-image.pipe';
import { DeleteImageAvatarCommand } from '../application/use-cases/delete-image-avatar.use-case';
import { AvatarsViewModel } from './view-models/avatars-view.dto';
import { IUsersQueryRepository } from '../infrastructure/users.query-repository';
import { NotificationErrors } from '@common/main/validators/checker-notification.errors';
import { NotificationCode } from '@common/configuration/notificationCode';

@ApiBearerAuth()
@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus, private readonly usersQueryRepository: IUsersQueryRepository) {}

  /**
   * @description Update profile user
   * @param userId
   * @param body
   */
  @SwaggerDecoratorsByUpdateProfile()
  @Put('/profile')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async updateProfile(@CurrentUserId() userId: number, @Body() body: UpdateProfileInputDto): Promise<null> {
    const notification = await this.commandBus.execute<UpdateProfileCommand, ResultNotification<null>>(
      new UpdateProfileCommand(userId, body),
    );
    return notification.getData();
  }

  /**
   * @description Get profile user
   * @param userId
   */
  @SwaggerDecoratorsByGetProfile()
  @Get(`/profile`)
  @HttpCode(HTTP_Status.OK_200)
  async getMyProfile(@CurrentUserId() userId: number): Promise<ProfileViewModel> {
    const profile = await this.usersQueryRepository.findUserProfile(userId);
    if (!profile) {
      const notification = new ResultNotification<ProfileViewModel>();
      notification.addErrorFromNotificationException(
        new NotificationException(`Profile not found with ${userId}`, 'profile', NotificationCode.NOT_FOUND),
      );
      throw new NotificationErrors(notification);
    }
    return profile;
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
    @UploadedFile(new ValidationImagePipe(typeImageAvatar))
    file: Express.Multer.File,
  ): Promise<AvatarsViewModel> {
    await this.commandBus.execute<UploadImageAvatarCommand, ResultNotification<null>>(
      new UploadImageAvatarCommand(userId, file),
    );
    return this.usersQueryRepository.findUserAvatars(userId);
  }

  /**
   * @description Delete photo avatar for user
   * @param userId
   */
  @SwaggerDecoratorsByDeletePhotoAvatar()
  @Delete('/profile/avatar')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async deleteAvatarProfile(@CurrentUserId() userId: number) {
    const notification = await this.commandBus.execute<DeleteImageAvatarCommand, ResultNotification<null>>(
      new DeleteImageAvatarCommand(userId),
    );
    return notification.getData();
  }
}
