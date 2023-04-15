import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { UpdateProfileInputDto } from '../../api/inpu-dto/update-profile.input.dto';
import { IUsersRepository } from '../../infrastructure/users.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { ProfileViewDto } from '../../api/view-models/profile-view.dto';

export class UpdateProfileCommand {
  constructor(public readonly userId: number, public readonly body: UpdateProfileInputDto) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileUseCase
  extends BaseNotificationUseCase<UpdateProfileCommand, ProfileViewDto>
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(private readonly userRepository: IUsersRepository) {
    super();
  }

  async executeUseCase(command: UpdateProfileCommand): Promise<ProfileViewDto> {
    const { userId, body } = command;
    const { userName } = body;

    //find foundUser by id
    const foundUser = await this.userRepository.findById(userId);
    if (!foundUser)
      throw new NotificationException(`User with id ${userId} not found`, 'id', NotificationCode.NOT_FOUND);

    //check userName is free
    if (userName) {
      const userWithReceivedUserName = await this.userRepository.findUserByUserName(userName);
      if (userWithReceivedUserName && userWithReceivedUserName.id !== foundUser.id) {
        throw new NotificationException(
          `User with userName ${userName} already exists`,
          'userName',
          NotificationCode.BAD_REQUEST,
        );
      }
    }

    //update profile
    foundUser.updateProfile(body);
    //save profile

    await this.userRepository.updateUser(foundUser);
    return ProfileViewDto.createView(foundUser.profile, foundUser.userName);
  }
}
