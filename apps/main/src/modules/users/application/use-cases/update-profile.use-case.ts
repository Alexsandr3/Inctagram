import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileInputDto } from '../../api/inpu-dto/update-profile.input.dto';
import { IUsersRepository } from '../../infrastructure/users.repository';
import { NotificationException } from '@common/main/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';

/**
 * @description Update profile for user command
 */
export class UpdateProfileCommand {
  constructor(public readonly userId: number, public readonly body: UpdateProfileInputDto) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileUseCase
  extends BaseNotificationUseCase<UpdateProfileCommand, void>
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(private readonly userRepository: IUsersRepository) {
    super();
  }

  /**
   * @description Checking the user's existence and updating the profile
   * @param command
   */
  async executeUseCase(command: UpdateProfileCommand): Promise<void> {
    const { userId, body } = command;
    const { userName } = body;

    //find foundUser by id
    const foundUser = await this.userRepository.findById(userId);
    if (!foundUser)
      throw new NotificationException(`User with id ${userId} not found`, 'id', NotificationCode.NOT_FOUND);

    //if userName is received
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
  }
}
