import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { CreateProfileInputDto } from '../../api/inpu-dto/create-profile.input.dto';
import { IUsersRepository } from '../../infrastructure/users.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { ProfileEntity } from '../../domain/profile.entity';
import { IProfilesRepository } from '../../infrastructure/profiles.repository';
import { ProfileViewDto } from '../../api/view-models/profile-view.dto';

export class CreateProfileCommand {
  constructor(public readonly userId: number, public readonly body: CreateProfileInputDto) {}
}

@CommandHandler(CreateProfileCommand)
export class CreateProfileUseCase
  extends BaseNotificationUseCase<CreateProfileCommand, ProfileViewDto>
  implements ICommandHandler<CreateProfileCommand>
{
  constructor(
    private readonly userRepository: IUsersRepository,
    private readonly profileRepository: IProfilesRepository,
  ) {
    super();
  }

  async executeUseCase(command: CreateProfileCommand): Promise<ProfileViewDto> {
    const { userId, body } = command;
    const { userName, lastName, city, dateOfBirth, firstName, aboutMe } = body;
    //find user by id
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id ${userId} not found`, 'id', NotificationCode.NOT_FOUND);
    //check userName is unique
    if (!user.isUserNameUnique(userName))
      throw new NotificationException(
        `User with userName ${userName} already exists`,
        'userName',
        NotificationCode.BAD_REQUEST,
      );
    //check exist profile
    const foundProfile = await this.profileRepository.findById(userId);
    if (foundProfile)
      throw new NotificationException(`Profile already exists`, 'profile', NotificationCode.BAD_REQUEST);
    //create profile
    const profile = ProfileEntity.initCreate(userId, userName, firstName, lastName, city, dateOfBirth, aboutMe);
    //save profile
    await this.profileRepository.createProfile(profile);

    return ProfileViewDto.createView(profile);
  }
}
