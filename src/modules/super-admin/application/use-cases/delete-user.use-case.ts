import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';

export class DeleteUserCommand {
  constructor(public readonly userId: number) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
  extends BaseNotificationUseCase<DeleteUserCommand, boolean>
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(private readonly usersRepository: IUsersRepository) {
    super();
  }

  async executeUseCase(command: DeleteUserCommand): Promise<boolean> {
    const { userId } = command;

    //find profile
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    user.setStatusDeleted();
    await this.usersRepository.updateUser(user);
    return true;
  }
}
