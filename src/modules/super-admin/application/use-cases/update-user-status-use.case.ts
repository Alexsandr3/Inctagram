import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';

export class UpdateUserStatusCommand {
  constructor(public readonly userId: number, public readonly banReason: string, public readonly isBanned: boolean) {}
}

@CommandHandler(UpdateUserStatusCommand)
export class UpdateUserStatusUseCase
  extends BaseNotificationUseCase<UpdateUserStatusCommand, boolean>
  implements ICommandHandler<UpdateUserStatusCommand>
{
  constructor(private readonly usersRepository: IUsersRepository) {
    super();
  }

  async executeUseCase(command: UpdateUserStatusCommand): Promise<boolean> {
    const { userId, banReason, isBanned } = command;
    //find profile
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    //if user isBanned = true, ban user, else unban user
    isBanned ? user.setStatusBanned(banReason) : user.setStatusActive();
    //update user with new status
    await this.usersRepository.updateUser(user);
    return true;
  }
}
