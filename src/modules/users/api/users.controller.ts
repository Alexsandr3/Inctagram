import {
  Body,
  Controller,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { typeImageAvatar } from '../default-options-images';
import {
  SwaggerDecoratorsByCreateProfile,
  SwaggerDecoratorsByFormData,
  SwaggerDecoratorsByGetProfile,
  SwaggerDecoratorsByUpdateProfile,
  SwaggerDecoratorsByUploadPhotoAvatar,
} from '../swagger.users.decorators';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { UploadImageAvatarCommand } from '../aplication/use-cases/upload-image-avatar.use-case';
import { NotificationException, ResultNotification } from '../../../main/validators/result-notification';
import { CreateProfileCommand } from '../aplication/use-cases/create-profile.use-case';
import { CreateProfileInputDto } from './inpu-dto/create-profile.input.dto';
import { ProfileViewDto } from './view-models/profile-view.dto';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';
import { UpdateProfileCommand } from '../aplication/use-cases/update-profile.use-case';
import { IProfilesRepository } from '../infrastructure/profiles.repository';
import { NotificationCode } from '../../../configuration/exception.filter';
import { CheckerNotificationErrors } from '../../../main/validators/checker-notification.errors';
import { ValidationTypeImagePipe } from '../../../main/validators/validation-type-image.pipe';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus, private readonly profileRepo: IProfilesRepository) {}

  @SwaggerDecoratorsByCreateProfile()
  @Post('/profile')
  @HttpCode(HTTP_Status.CREATED_201)
  async createProfile(@CurrentUserId() userId: number, @Body() body: CreateProfileInputDto): Promise<ProfileViewDto> {
    const notification = await this.commandBus.execute<CreateProfileCommand, ResultNotification<ProfileViewDto>>(
      new CreateProfileCommand(userId, body),
    );
    return notification.getData();
  }

  @SwaggerDecoratorsByUpdateProfile()
  @Put('/profile')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async updateProfile(@CurrentUserId() userId: number, @Body() body: CreateProfileInputDto): Promise<null> {
    const notification = await this.commandBus.execute<CreateProfileCommand, ResultNotification<null>>(
      new UpdateProfileCommand(userId, body),
    );
    return notification.getData();
  }

  @SwaggerDecoratorsByGetProfile()
  @Get(`/profile/:id`)
  @HttpCode(HTTP_Status.OK_200)
  async getProfile(@Param('id', ParseIntPipe) userId: number): Promise<ProfileViewDto> {
    const profile = await this.profileRepo.findById(userId);
    const notification = new ResultNotification<ProfileViewDto>();
    notification.addErrorFromNotificationException(
      new NotificationException(`Profile not found with ${userId}`, 'profile', NotificationCode.NOT_FOUND),
    );
    if (!profile) throw new CheckerNotificationErrors('Error', notification);
    return ProfileViewDto.createView(profile);
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
    @UploadedFile(new ValidationTypeImagePipe(typeImageAvatar))
    file: Express.Multer.File,
  ) {
    const notification = await this.commandBus.execute<UploadImageAvatarCommand, ResultNotification<null>>(
      new UploadImageAvatarCommand(userId, file.mimetype, file.buffer),
    );
    return notification.getData();
  }
}
