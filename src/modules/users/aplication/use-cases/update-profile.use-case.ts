import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { CreateProfileInputDto } from '../../api/inpu-dto/create-profile.input.dto';
import { IUsersRepository } from '../../infrastructure/users.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { IProfilesRepository } from '../../infrastructure/profiles.repository';

export class UpdateProfileCommand {
  constructor(public readonly userId: number, public readonly body: CreateProfileInputDto) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileUseCase
  extends BaseNotificationUseCase<UpdateProfileCommand, void>
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(
    private readonly userRepository: IUsersRepository,
    private readonly profileRepository: IProfilesRepository,
  ) {
    super();
  }

  async executeUseCase(command: UpdateProfileCommand): Promise<void> {
    const { userId, body } = command;
    const { userName, lastName, city, dateOfBirth, firstName, aboutMe } = body;
    //find user by id
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id ${userId} not found`, 'id', NotificationCode.NOT_FOUND);
    //check exist profile
    const foundProfile = await this.profileRepository.findById(userId);
    if (!foundProfile)
      throw new NotificationException(`Profile already exists`, 'profile', NotificationCode.BAD_REQUEST);
    //create profile
    const updateProfile = await foundProfile.update(userName, firstName, lastName, city, dateOfBirth, aboutMe);
    //save profile
    await this.profileRepository.updateProfile(updateProfile);
  }
}
